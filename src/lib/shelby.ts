import { ShelbyNodeClient } from "@shelby-protocol/sdk/node"
import { Network } from "@aptos-labs/ts-sdk"

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
