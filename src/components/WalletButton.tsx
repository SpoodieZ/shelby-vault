"use client"

import { useState } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

const pink = "#FF6FD8"
const pinkDim = "rgba(255,111,216,0.12)"
const pinkDimBorder = "rgba(255,111,216,0.25)"
const textPrimary = "#2C1A14"
const textSecondary = "#7A5C52"
const textMuted = "#B89A91"
const border = "#EFE0DB"
const bgCard = "#FFFFFF"

function truncate(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletButton() {
  const { connected, account, wallets, connect, disconnect, isLoading } = useWallet()
  const [showModal, setShowModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Connected state — show address dropdown
  if (connected && account) {
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowDropdown((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: pinkDim, border: `1px solid ${pinkDimBorder}`,
            borderRadius: 999, padding: "6px 14px",
            cursor: "pointer", fontSize: 13, fontWeight: 600, color: pink,
            transition: "all 0.15s",
          }}
        >
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#22c55e", flexShrink: 0,
          }} />
          {truncate(account.address.toString())}
          <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
        </button>

        {showDropdown && (
          <>
            <div
              onClick={() => setShowDropdown(false)}
              style={{ position: "fixed", inset: 0, zIndex: 40 }}
            />
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50,
              background: bgCard, border: `1px solid ${border}`,
              borderRadius: 14, padding: 8, minWidth: 220,
              boxShadow: "0 8px 24px rgba(44,26,20,0.12)",
            }}>
              {/* Address */}
              <div style={{ padding: "8px 12px", borderBottom: `1px solid ${border}`, marginBottom: 4 }}>
                <p style={{ margin: 0, fontSize: 11, color: textMuted, fontWeight: 500 }}>CONNECTED WALLET</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: textSecondary, fontFamily: "monospace", wordBreak: "break-all" }}>
                  {account.address.toString()}
                </p>
              </div>

              {/* Explorer link */}
              <a
                href={`https://explorer.shelby.xyz/shelbynet/account/${account.address.toString()}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: 8, textDecoration: "none",
                  color: textSecondary, fontSize: 13,
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FFF3FB")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}
              >
                🔍 View on Explorer
              </a>

              {/* Disconnect */}
              <button
                onClick={() => { disconnect(); setShowDropdown(false) }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: 8, border: "none",
                  background: "none", color: "#DC2626", fontSize: 13,
                  cursor: "pointer", textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FFF0F0")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}
              >
                ⏏ Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  // Not connected — show connect button + modal
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isLoading}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          background: pink, border: "none",
          borderRadius: 999, padding: "7px 16px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: 13, fontWeight: 600, color: "#fff",
          transition: "opacity 0.15s",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 0 0-4 0v2"/>
          <circle cx="12" cy="14" r="1.5" fill="white" stroke="none"/>
        </svg>
        Connect Wallet
      </button>

      {/* Wallet select modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(44,26,20,0.3)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: bgCard, borderRadius: 20, padding: 24,
              width: "100%", maxWidth: 380,
              boxShadow: "0 24px 64px rgba(44,26,20,0.18)",
              margin: 16,
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: textPrimary }}>Connect Wallet</h3>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: textMuted }}>Choose your Aptos wallet</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: textMuted, fontSize: 20, padding: 4, lineHeight: 1,
                }}
              >×</button>
            </div>

            {/* Wallet list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {wallets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: textMuted, fontSize: 14 }}>
                  <p style={{ margin: "0 0 12px" }}>No wallets detected</p>
                  <a
                    href="https://petra.app"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: pink, fontWeight: 600, textDecoration: "none" }}
                  >
                    Install Petra Wallet →
                  </a>
                </div>
              ) : (
                wallets.map((wallet) => {
                  const isInstalled = "readyState" in wallet && (wallet as any).readyState === "Installed"
                  return (
                    <button
                      key={wallet.name}
                      onClick={() => {
                        connect(wallet.name)
                        setShowModal(false)
                      }}
                      disabled={!isInstalled}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "12px 16px", borderRadius: 12,
                        border: `1px solid ${border}`,
                        background: isInstalled ? bgCard : "#FAFAFA",
                        cursor: isInstalled ? "pointer" : "not-allowed",
                        opacity: isInstalled ? 1 : 0.5,
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => isInstalled && (e.currentTarget.style.background = "#FFF3FB")}
                      onMouseLeave={e => (e.currentTarget.style.background = isInstalled ? bgCard : "#FAFAFA")}
                    >
                      {wallet.icon && (
                        <img
                          src={wallet.icon}
                          alt={wallet.name}
                          style={{ width: 36, height: 36, borderRadius: 8 }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: textPrimary }}>{wallet.name}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: textMuted }}>
                          {isInstalled ? "Ready to connect" : "Not installed"}
                        </p>
                      </div>
                      {isInstalled && (
                        <span style={{ color: pink, fontSize: 16 }}>→</span>
                      )}
                    </button>
                  )
                })
              )}
            </div>

            {/* Footer note */}
            <p style={{ margin: "16px 0 0", fontSize: 12, color: textMuted, textAlign: "center" }}>
              Powered by Aptos Wallet Standard
            </p>
          </div>
        </div>
      )}
    </>
  )
}
