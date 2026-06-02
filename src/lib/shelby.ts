import { ShelbyNodeClient } from "@shelby-protocol/sdk/node"
import { Network } from "@aptos-labs/ts-sdk"

// Shelby API requires Origin header even for server-side requests.
// Patch globalThis.fetch once to inject it for all shelby.xyz / aptoslabs.com calls.
if (typeof window === "undefined") {
  const APP_ORIGIN =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://shelby-vault-alpha.vercel.app"
  const _nativeFetch = globalThis.fetch
  globalThis.fetch = function shelbyFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : (input as Request).url
    if (url.includes("shelby.xyz") || url.includes("aptoslabs.com")) {
      const headers = new Headers(init?.headers as HeadersInit | undefined)
      if (!headers.has("Origin")) headers.set("Origin", APP_ORIGIN)
      return _nativeFetch(input, { ...init, headers })
    }
    return _nativeFetch(input, init)
  }
}

let _client: ShelbyNodeClient | null = null

export function getShelbyClient(): ShelbyNodeClient {
  if (_client) return _client

  _client = new ShelbyNodeClient({
    network: Network.SHELBYNET,
    apiKey: process.env.SHELBY_API_KEY || undefined,
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
