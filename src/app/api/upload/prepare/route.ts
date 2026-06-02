import { NextRequest, NextResponse } from "next/server"
import {
  createDefaultErasureCodingProvider,
  generateCommitments,
  defaultErasureCodingConfig,
} from "@shelby-protocol/sdk/node"
import { getAccountAddress } from "@/lib/shelby"

export const maxDuration = 60

// In-memory temp store — cleared after expiry
const pending = new Map<string, {
  blobData: Uint8Array
  blobName: string
  expirationMicros: number
  walletAddress: string
}>()

setInterval(() => {
  const nowMicros = Date.now() * 1000
  for (const [k, v] of pending) {
    if (v.expirationMicros < nowMicros) pending.delete(k)
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

    // Generate erasure coding commitments server-side (CPU-heavy)
    const provider = await createDefaultErasureCodingProvider()
    const config = defaultErasureCodingConfig()
    await generateCommitments(provider, blobData) // validate the data

    const expirationMicros = (Date.now() + 7 * 24 * 60 * 60 * 1000) * 1000
    const blobName = `${walletAddress.slice(0, 10)}/${Date.now()}-${file.name}`
    const token = crypto.randomUUID()

    pending.set(token, { blobData, blobName, expirationMicros, walletAddress })

    // User authorizes the upload by sending a small APT transfer to server.
    // Server account is the blob owner — this avoids RPC owner-mismatch issues.
    // The payment is the on-chain "transaction when using" requirement.
    const serverAddress = getAccountAddress()
    const PAYMENT_OCTAS = 1000 // 0.00001 APT — negligible on testnet

    const txPayload = {
      function: "0x1::aptos_account::transfer" as `${string}::${string}::${string}`,
      functionArguments: [serverAddress, PAYMENT_OCTAS],
    }

    return NextResponse.json({
      token,
      blobName,
      txPayload,
      paymentOctas: PAYMENT_OCTAS,
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
