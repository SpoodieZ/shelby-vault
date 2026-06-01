import { NextRequest, NextResponse } from "next/server"
import { AccountAddress } from "@aptos-labs/ts-sdk"
import { getShelbyClient, getAccountAddress } from "@/lib/shelby"

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const blobName = req.nextUrl.searchParams.get("blobName")

  if (!blobName) {
    return NextResponse.json({ error: "blobName is required" }, { status: 400 })
  }

  try {
    const client = getShelbyClient()
    const address = getAccountAddress()

    const blob = await client.download({
      account: AccountAddress.fromString(address),
      blobName,
    })

    const chunks: Uint8Array[] = []
    const reader = blob.readable.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value as Uint8Array)
    }

    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0)
    const combined = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      combined.set(chunk, offset)
      offset += chunk.length
    }

    // Strip the timestamp prefix to get original filename
    const originalName = blobName.replace(/^\d+-/, "")

    return new NextResponse(combined, {
      headers: {
        "Content-Disposition": `attachment; filename="${originalName}"`,
        "Content-Type": "application/octet-stream",
        "Content-Length": combined.length.toString(),
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Download failed"
    console.error("Download error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
