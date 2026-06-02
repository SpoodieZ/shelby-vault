import { ShelbyNodeClient } from "@shelby-protocol/sdk/node"
import { Network } from "@aptos-labs/ts-sdk"

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://shelby-vault-alpha.vercel.app"

// Shelby requires Origin header even for server-side requests (Node.js fetch doesn't add it).
// Patch once at module load so all fetch calls to shelby.xyz / aptoslabs.com include it.
if (typeof window === "undefined") {
  const _native = globalThis.fetch
  globalThis.fetch = function (input, init) {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : (input as Request).url
    if (url.includes("shelby.xyz") || url.includes("aptoslabs.com")) {
      const h = new Headers(init?.headers as HeadersInit)
      if (!h.has("Origin")) h.set("Origin", APP_ORIGIN)
      return _native(input, { ...init, headers: h })
    }
    return _native(input, init)
  }
}

let _client: ShelbyNodeClient | null = null

export function getShelbyClient(): ShelbyNodeClient {
  if (_client) return _client

  _client = new ShelbyNodeClient({
    network: Network.SHELBYNET,
    apiKey: process.env.SHELBY_API_KEY || undefined,
    // Pass Origin via Aptos clientConfig.HEADERS so fullnode + indexer get it too
    aptos: {
      clientConfig: {
        API_KEY: process.env.SHELBY_API_KEY || undefined,
        HEADERS: { Origin: APP_ORIGIN },
      },
    },
  })

  return _client
}

export function getAccountAddress(): string {
  const address = process.env.SHELBY_ACCOUNT_ADDRESS
  if (!address) throw new Error("SHELBY_ACCOUNT_ADDRESS must be set in .env.local")
  return address
}

export function getPrivateKey(): string {
  const key = process.env.SHELBY_ACCOUNT_PRIVATE_KEY
  if (!key) throw new Error("SHELBY_ACCOUNT_PRIVATE_KEY must be set in .env.local")
  return key
}
