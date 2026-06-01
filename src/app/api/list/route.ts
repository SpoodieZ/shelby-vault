import { NextResponse } from "next/server"
import { AccountAddress } from "@aptos-labs/ts-sdk"
import { getShelbyClient, getAccountAddress } from "@/lib/shelby"

export async function GET() {
  try {
    const client = getShelbyClient()
    const address = getAccountAddress()

    const blobs = await client.coordination.getAccountBlobs({
      account: AccountAddress.fromString(address),
    })

    const files = blobs
      .filter((b) => !b.isDeleted)
      .map((blob) => ({
        blobName: blob.blobNameSuffix,
        size: blob.size,
        expirationMicros: blob.expirationMicros,
        creationMicros: blob.creationMicros,
        isWritten: blob.isWritten,
      }))

    return NextResponse.json({ files, indexerUnavailable: false })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to list files"
    const isAuthError =
      err instanceof Error &&
      (err.message.includes("Unauthorized") || err.message.includes("401") || err.message.includes("api-key"))

    console.error("List error:", message)

    // Return empty list with flag instead of crashing — client will use localStorage fallback
    if (isAuthError) {
      return NextResponse.json({ files: [], indexerUnavailable: true })
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
