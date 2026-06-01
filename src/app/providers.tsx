"use client"

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import { type ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{ network: "shelbynet" as any }}
      optInWallets={["Petra", "Continue with Google", "Continue with Apple"]}
      onError={(error) => console.warn("Wallet error:", error)}
    >
      {children}
    </AptosWalletAdapterProvider>
  )
}
