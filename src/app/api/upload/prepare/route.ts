import { NextRequest, NextResponse } from "next/server"
import {
  createDefaultErasureCodingProvider,
  generateCommitments,
  expectedTotalChunksets,
  SHELBY_DEPLOYER,
  defaultErasureCodingConfig,
} from "@shelby-protocol/sdk/node"
import { Hex } from "@aptos-labs/ts-sdk"

export const maxDuration = 60

// In-memory temp store: token → { blobData, blobName, expirationMicros }
// Cleared after 10 min to avoid memory leak
const pending = new Map<string, { blobData: Uint8Array; blobName: string; expirationMicros: number }>()
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of pending) {
    if (v.expirationMicros / 1000 < now) pending.delete(k)
  }
}, 60_000)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const walletAddress = formData.get("walletAddress") as string | null

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (!walletAddress) return NextResponse.json({ error: "Wallet not connected" }, { status: 400 })
    if (file.size > 100 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 400 })

    const buffer = await file.arrayBuffer()
    const blobData = new Uint8Array(buffer)

    // Generate erasure coding commitments on server (CPU-heavy)
    const provider = await createDefaultErasureCodingProvider()
    const config = defaultErasureCodingConfig()
    const commitments = await generateCommitments(provider, blobData)

    const expirationMicros = (Date.now() + 7 * 24 * 60 * 60 * 1000) * 1000
    const blobName = `${walletAddress.slice(0, 10)}/${Date.now()}-${file.name}`
    const chunksetSize = config.chunkSizeBytes * config.erasure_k
    const numChunksets = expectedTotalChunksets(blobData.length, chunksetSize)

    // Store blob data temporarily (keyed by blobName)
    const token = crypto.randomUUID()
    pending.set(token, { blobData, blobName, expirationMicros })

    // Build the register_blob Move function payload
    // User's wallet will sign and submit this transaction
    const txPayload = {
      function: `${SHELBY_DEPLOYER}::blob_metadata::register_blob` as `${string}::${string}::${string}`,
      functionArguments: [
        blobName,
        expirationMicros,
        Hex.fromHexString(commitments.blob_merkle_root).toUint8Array(),
        numChunksets,
        blobData.length,
        0,                    // TODO field
        config.enumIndex,     // encoding variant index
      ],
    }

    return NextResponse.json({
      token,
      blobName,
      txPayload,
      size: blobData.length,
      expirationMicros,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Prepare failed"
    console.error("Prepare error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export { pending }
