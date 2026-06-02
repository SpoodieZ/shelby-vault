import { NextResponse } from "next/server"
import { getAccountAddress } from "@/lib/shelby"

const SHELBYNET_FULLNODE = "https://api.shelbynet.shelby.xyz/v1"
const SHELBYNET_INDEXER = "https://api.shelbynet.shelby.xyz/v1/graphql"
const SHELBY_DEPLOYER = "0x85fdb9a176ab8ef1d9d9c1b60d60b3924f0800ac1de1cc2085fb0b8bb4988e6a"
const PAGE_SIZE = 500

let cachedTableHandle: string | null = null

async function getBlobTableHandle(): Promise<string> {
  if (cachedTableHandle) return cachedTableHandle

  const res = await fetch(
    `${SHELBYNET_FULLNODE}/accounts/${SHELBY_DEPLOYER}/resource/${SHELBY_DEPLOYER}::blob_metadata::Blobs`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error(`Failed to fetch Blobs resource: ${res.status}`)
  const data = await res.json()
  const handle = data?.data?.blob_data?.handle
  if (!handle) throw new Error("blob_data.handle not found in Blobs resource")
  cachedTableHandle = handle
  return handle
}

interface RawBlobValue {
  owner?: string
  blob_size?: string
  expiration_micros?: string
  creation_micros?: string
  is_written?: boolean
  is_deleted?: boolean
}

interface BlobEntry {
  key: string
  value: { value: RawBlobValue; __variant__: string }
}

function parsePagesForOwner(pages: { decoded_value: unknown }[], ownerAddress: string) {
  const normalizedOwner = ownerAddress.toLowerCase().replace(/^0x/, "")

  const files: {
    blobName: string
    size: number
    expirationMicros: number
    creationMicros: number
    isWritten: boolean
  }[] = []

  for (const page of pages) {
    const dv = page.decoded_value as Record<string, unknown>
    const entries = (
      (dv?.root as Record<string, unknown>)?.children as Record<string, unknown>
    )?.entries as BlobEntry[] | undefined

    if (!Array.isArray(entries)) continue

    for (const entry of entries) {
      const v = entry?.value?.value
      if (!v?.owner) continue

      const entryOwner = v.owner.toLowerCase().replace(/^0x/, "")
      if (entryOwner !== normalizedOwner) continue

      if (v.is_deleted) continue

      const nowMicros = Date.now() * 1000
      const expiration = Number(v.expiration_micros ?? 0)
      if (expiration > 0 && expiration < nowMicros) continue

      // Strip the @address/ prefix to get the blobName suffix
      const blobName = entry.key.replace(/^@[^/]+\//, "")

      files.push({
        blobName,
        size: Number(v.blob_size ?? 0),
        expirationMicros: expiration,
        creationMicros: Number(v.creation_micros ?? 0),
        isWritten: Boolean(v.is_written),
      })
    }
  }

  return files
}

async function fetchBlobsFromPublicIndexer(ownerAddress: string) {
  const handle = await getBlobTableHandle()

  const allPages: { decoded_value: unknown }[] = []
  let offset = 0

  while (true) {
    const res = await fetch(SHELBYNET_INDEXER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          table_items(
            limit: ${PAGE_SIZE},
            offset: ${offset},
            where: { table_handle: { _eq: "${handle}" } }
          ) {
            decoded_value
          }
        }`,
      }),
    })

    if (!res.ok) throw new Error(`Indexer request failed: ${res.status}`)
    const data = await res.json()

    if (data.errors?.length) {
      throw new Error(data.errors[0]?.message ?? "GraphQL error")
    }

    const pages: { decoded_value: unknown }[] = data?.data?.table_items ?? []
    allPages.push(...pages)

    if (pages.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  return parsePagesForOwner(allPages, ownerAddress)
}

export async function GET() {
  try {
    const address = getAccountAddress()
    const files = await fetchBlobsFromPublicIndexer(address)
    return NextResponse.json({ files, indexerUnavailable: false })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to list files"
    console.error("List error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
