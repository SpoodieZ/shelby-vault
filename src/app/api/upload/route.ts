import { NextRequest, NextResponse } from "next/server"
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk"
import { getShelbyClient, getPrivateKey } from "@/lib/shelby"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 400 })
    }

    const client = getShelbyClient()
    const privateKey = getPrivateKey()

    const account = Account.fromPrivateKey({
      privateKey: new Ed25519PrivateKey(privateKey),
    })

    const buffer = await file.arrayBuffer()
    const blobData = new Uint8Array(buffer)

    // Expire in 7 days (microseconds)
    const expirationMicros = (Date.now() + 7 * 24 * 60 * 60 * 1000) * 1000

    const blobName = `${Date.now()}-${file.name}`

    await client.upload({
      blobData,
      signer: account,
      blobName,
      expirationMicros,
    })

    return NextResponse.json({
      success: true,
      blobName,
      fileName: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed"
    console.error("Upload error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
