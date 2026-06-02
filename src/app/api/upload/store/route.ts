import { NextRequest, NextResponse } from "next/server"
import { Account, Ed25519PrivateKey, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk"
import { getShelbyClient, getAccountAddress, getPrivateKey } from "@/lib/shelby"
import { pending } from "../prepare/route"

export const maxDuration = 60

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://shelby-vault-alpha.vercel.app"

const aptos = new Aptos(
  new AptosConfig({
    network: Network.SHELBYNET,
    clientConfig: {
      API_KEY: process.env.SHELBY_API_KEY || undefined,
      HEADERS: { Origin: APP_ORIGIN },
    },
  })
)

export async function POST(req: NextRequest) {
  try {
    const { token, txHash, walletAddress } = await req.json()

    if (!token || !txHash || !walletAddress) {
      return NextResponse.json({ error: "token, txHash and walletAddress required" }, { status: 400 })
    }

    const entry = pending.get(token)
    if (!entry) {
      return NextResponse.json({ error: "Upload session expired or invalid token" }, { status: 400 })
    }

    const { blobData, blobName, expirationMicros } = entry

    // Verify the authorization transaction was committed on-chain
    const txInfo = await aptos.waitForTransaction({ transactionHash: txHash })
    if (!txInfo.success) {
      pending.delete(token)
      return NextResponse.json({ error: "Authorization transaction failed on-chain" }, { status: 400 })
    }

    // Upload using server account as blob owner (server key owns the blob on Shelby RPC)
    const client = getShelbyClient()
    const serverAccount = Account.fromPrivateKey({
      privateKey: new Ed25519PrivateKey(getPrivateKey()),
    })

    await client.upload({
      blobData,
      signer: serverAccount,
      blobName,
      expirationMicros,
    })

    pending.delete(token)

    return NextResponse.json({
      success: true,
      blobName,
      size: blobData.length,
      walletAddress,
      txHash,
      expirationMicros,
      uploadedAt: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Store failed"
    console.error("Store error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
