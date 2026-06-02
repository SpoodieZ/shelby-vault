import { NextRequest, NextResponse } from "next/server"

const APT_FAUCET = "https://faucet.shelbynet.shelby.xyz"
const APT_AMOUNT = 100_000_000 // 1 APT in octas

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json()
    if (!address || typeof address !== "string") {
      return NextResponse.json({ error: "address required" }, { status: 400 })
    }

    const res = await fetch(
      `${APT_FAUCET}/mint?amount=${APT_AMOUNT}&auth_key=${address}`,
      { method: "POST" }
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text || "Faucet request failed" }, { status: res.status })
    }

    const txHashes: string[] = await res.json()
    return NextResponse.json({ success: true, txHashes, amount: APT_AMOUNT })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Faucet error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
