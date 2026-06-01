"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { WalletButton } from "./WalletButton"

interface FileEntry {
  blobName: string
  size: number
  expirationMicros: number | null
  creationMicros: number | null
  isWritten: boolean
}

type Lang = "vi" | "en"

const STORAGE_KEY = "shelby_vault_files"

interface LocalFile {
  blobName: string
  size: number
  expirationMicros: number
  creationMicros: number
  isWritten: boolean
}

function saveToLocal(file: LocalFile) {
  try {
    const existing: LocalFile[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
    const updated = [file, ...existing.filter((f) => f.blobName !== file.blobName)]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {}
}

function loadFromLocal(): LocalFile[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
  } catch {
    return []
  }
}

const t = {
  vi: {
    subtitle: "Lưu trữ phi tập trung trên Shelbynet",
    network: "Shelbynet Testnet",
    uploading: "Đang upload lên Shelby network...",
    uploadingHint: "Đang mã hoá và phân phối dữ liệu",
    dropzone: "Kéo thả file vào đây hoặc click để chọn",
    dropzoneHint: "Tối đa 100MB · Lưu trữ phi tập trung",
    uploadSuccess: (name: string) => `"${name}" đã upload thành công!`,
    fileListTitle: "Files của bạn",
    refresh: "Làm mới",
    refreshing: "...",
    loadingList: "Đang tải...",
    emptyTitle: "Chưa có file nào",
    emptyHint: "Upload file đầu tiên để bắt đầu",
    expires: "Hết hạn",
    processing: "đang xử lý",
    download: "Tải về",
    downloading: "...",
    footer: "Powered by Shelby Protocol · Aptos Blockchain",
    langLabel: "EN",
  },
  en: {
    subtitle: "Decentralized Storage on Shelbynet",
    network: "Shelbynet Testnet",
    uploading: "Uploading to Shelby network...",
    uploadingHint: "Encrypting and distributing your data",
    dropzone: "Drag & drop a file here, or click to select",
    dropzoneHint: "Max 100MB · Decentralized storage",
    uploadSuccess: (name: string) => `"${name}" uploaded successfully!`,
    fileListTitle: "Your Files",
    refresh: "Refresh",
    refreshing: "...",
    loadingList: "Loading...",
    emptyTitle: "No files yet",
    emptyHint: "Upload your first file to get started",
    expires: "Expires",
    processing: "processing",
    download: "Download",
    downloading: "...",
    footer: "Powered by Shelby Protocol · Aptos Blockchain",
    langLabel: "VI",
  },
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getFileName(blobName: string): string {
  return blobName.replace(/^\d+-/, "")
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  const icons: Record<string, string> = {
    pdf: "📄", png: "🖼", jpg: "🖼", jpeg: "🖼", gif: "🖼", webp: "🖼",
    mp4: "🎬", mov: "🎬", avi: "🎬", mkv: "🎬",
    mp3: "🎵", wav: "🎵", flac: "🎵",
    zip: "📦", tar: "📦", gz: "📦", rar: "📦",
    py: "🐍", ts: "📘", js: "📘", json: "📋",
    csv: "📊", xlsx: "📊", xls: "📊",
    txt: "📝", md: "📝",
  }
  return icons[ext] ?? "📁"
}

// Shelby hexagon logo SVG
function ShelbyHexLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <polygon
        points="18,2 32,10 32,26 18,34 4,26 4,10"
        fill="#FF6FD8"
        opacity="0.15"
        stroke="#FF6FD8"
        strokeWidth="1.5"
      />
      <polygon
        points="18,7 28,13 28,23 18,29 8,23 8,13"
        fill="#FF6FD8"
        opacity="0.25"
      />
      <circle cx="18" cy="18" r="5" fill="#FF6FD8" />
    </svg>
  )
}

export default function FileVault() {
  const { connected, account } = useWallet()
  const walletAddress = account?.address?.toString() ?? null

  const [lang, setLang] = useState<Lang>("en")
  const [files, setFiles] = useState<FileEntry[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [usingLocal, setUsingLocal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const tx = t[lang]

  const loadFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/list")
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      if (data.indexerUnavailable) {
        // Indexer needs API key — use localStorage instead
        setUsingLocal(true)
        setFiles(loadFromLocal())
      } else {
        setUsingLocal(false)
        setFiles(data.files ?? [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadFiles() }, [loadFiles])

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError(null)
    setUploadSuccess(null)
    const formData = new FormData()
    formData.append("file", file)
    if (walletAddress) formData.append("walletAddress", walletAddress)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Save to localStorage so it shows even without indexer API key
      saveToLocal({
        blobName: data.blobName,
        size: data.size,
        expirationMicros: (Date.now() + 7 * 24 * 60 * 60 * 1000) * 1000,
        creationMicros: Date.now() * 1000,
        isWritten: true,
      })

      setUploadSuccess(tx.uploadSuccess(file.name))
      await loadFiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDownload = async (blobName: string) => {
    setDownloading(blobName)
    try {
      const res = await fetch(`/api/download?blobName=${encodeURIComponent(blobName)}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Download failed")
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getFileName(blobName)
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed")
    } finally {
      setDownloading(null)
    }
  }

  // Shelby brand colors
  const pink = "#FF6FD8"
  const pinkLight = "#FFD6F5"
  const pinkDim = "rgba(255,111,216,0.12)"
  const pinkDimBorder = "rgba(255,111,216,0.25)"
  const bg = "#FDF7F5"           // warm cream — no black background
  const bgCard = "#FFFFFF"
  const bgCardHover = "#FFF3FB"
  const textPrimary = "#2C1A14"  // warm dark brown
  const textSecondary = "#7A5C52"
  const textMuted = "#B89A91"
  const border = "#EFE0DB"
  const borderStrong = "#DFC8C0"

  return (
    <div style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Geometric background pattern */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {/* Large faint hexagons */}
        <svg style={{ position: "absolute", top: -80, right: -80, opacity: 0.04 }} width="400" height="400" viewBox="0 0 400 400">
          <polygon points="200,20 360,110 360,290 200,380 40,290 40,110" fill="none" stroke={pink} strokeWidth="2"/>
          <polygon points="200,60 330,130 330,270 200,340 70,270 70,130" fill="none" stroke={pink} strokeWidth="1.5"/>
          <polygon points="200,100 300,155 300,245 200,300 100,245 100,155" fill="none" stroke={pink} strokeWidth="1"/>
        </svg>
        <svg style={{ position: "absolute", bottom: -100, left: -60, opacity: 0.04 }} width="350" height="350" viewBox="0 0 350 350">
          <polygon points="175,15 320,95 320,255 175,335 30,255 30,95" fill="none" stroke={pink} strokeWidth="2"/>
          <polygon points="175,55 285,120 285,230 175,295 65,230 65,120" fill="none" stroke={pink} strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(253,247,245,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border}`,
        padding: "0 32px",
        height: 64,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <ShelbyHexLogo size={32} />
        <div>
          <span style={{ fontSize: 17, fontWeight: 700, color: textPrimary, letterSpacing: "-0.02em" }}>Shelby Vault</span>
          <span style={{ fontSize: 12, color: textMuted, marginLeft: 8 }}>{tx.subtitle}</span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {/* Live badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, padding: "5px 12px", borderRadius: 999,
            background: "rgba(255,111,216,0.08)",
            border: `1px solid ${pinkDimBorder}`,
            color: pink, fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: pink, display: "inline-block" }} />
            {tx.network}
          </div>

          {/* Lang toggle */}
          <button onClick={() => setLang(l => l === "vi" ? "en" : "vi")} style={{
            background: bgCard, border: `1px solid ${border}`,
            borderRadius: 999, color: textSecondary,
            cursor: "pointer", padding: "5px 14px",
            fontSize: 12, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 5,
            transition: "all 0.15s",
          }}>
            {lang === "vi" ? "🇻🇳" : "🇺🇸"} {tx.langLabel}
          </button>

          {/* Wallet */}
          <WalletButton />
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* Hero text */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: textPrimary }}>
            Your decentralized{" "}
            <span style={{ color: pink }}>file vault</span>
          </h2>
          <p style={{ margin: 0, color: textSecondary, fontSize: 15 }}>
            {lang === "vi"
              ? "Upload, lưu trữ và tải file từ mạng lưới Shelby toàn cầu"
              : "Upload, store and retrieve files from the global Shelby network"}
          </p>

          {/* Wallet status */}
          {connected && walletAddress ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 12, padding: "6px 14px", borderRadius: 999,
              background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
              fontSize: 12, color: "#15803d", fontWeight: 500,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              {lang === "vi" ? "Đang upload với" : "Uploading as"}&nbsp;
              <span style={{ fontFamily: "monospace" }}>
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
              </span>
            </div>
          ) : (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 12, padding: "6px 14px", borderRadius: 999,
              background: "rgba(180,83,9,0.06)", border: "1px solid rgba(180,83,9,0.15)",
              fontSize: 12, color: "#92400e", fontWeight: 500,
            }}>
              🔌 {lang === "vi" ? "Kết nối wallet để lưu file theo địa chỉ của bạn" : "Connect wallet to store files under your address"}
            </div>
          )}
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? pink : uploading ? pinkDimBorder : border}`,
            borderRadius: 20,
            padding: "52px 24px",
            textAlign: "center",
            cursor: uploading ? "not-allowed" : "pointer",
            background: dragOver ? pinkDim : uploading ? "rgba(255,111,216,0.04)" : bgCard,
            transition: "all 0.2s",
            marginBottom: 20,
            boxShadow: dragOver ? `0 0 0 4px ${pinkDim}` : "0 1px 3px rgba(44,26,20,0.06)",
          }}
        >
          <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} disabled={uploading} />

          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              {/* Animated hexagon spinner */}
              <div style={{ animation: "spin 1.5s linear infinite", width: 40, height: 40 }}>
                <ShelbyHexLogo size={40} />
              </div>
              <p style={{ margin: 0, color: textPrimary, fontSize: 15, fontWeight: 600 }}>{tx.uploading}</p>
              <p style={{ margin: 0, color: textMuted, fontSize: 13 }}>{tx.uploadingHint}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: pinkDim, border: `1.5px solid ${pinkDimBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>
                ☁️
              </div>
              <p style={{ margin: 0, color: textPrimary, fontSize: 15, fontWeight: 600 }}>{tx.dropzone}</p>
              <p style={{ margin: 0, color: textMuted, fontSize: 13 }}>{tx.dropzoneHint}</p>
              <div style={{
                marginTop: 4,
                padding: "8px 20px", borderRadius: 999,
                background: pink, color: "#fff",
                fontSize: 13, fontWeight: 600,
                display: "inline-block",
              }}>
                {lang === "vi" ? "Chọn file" : "Choose file"}
              </div>
            </div>
          )}
        </div>

        {/* Local mode notice */}
        {usingLocal && (
          <div style={{
            background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: 12, padding: "10px 16px", marginBottom: 16,
            color: "#92400E", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠️</span>
            <span>
              {lang === "vi"
                ? "Indexer chưa có API key — danh sách file lưu trên trình duyệt này. File vẫn được upload lên Shelby network bình thường."
                : "Indexer API key not set — file list is stored in this browser. Files are still uploaded to the Shelby network normally."}
            </span>
          </div>
        )}

        {/* Success / Error */}
        {uploadSuccess && (
          <div style={{
            background: "rgba(255,111,216,0.06)", border: `1px solid ${pinkDimBorder}`,
            borderRadius: 12, padding: "12px 16px", marginBottom: 16,
            color: pink, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>✓</span> {uploadSuccess}
          </div>
        )}
        {error && (
          <div style={{
            background: "#FFF0F0", border: "1px solid #FFCDD2",
            borderRadius: 12, padding: "12px 16px", marginBottom: 16,
            color: "#C0392B", fontSize: 14, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>✕</span>
            <span style={{ flex: 1 }}>{error}</span>
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", color: "#C0392B", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* File list card */}
        <div style={{
          background: bgCard,
          border: `1px solid ${border}`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(44,26,20,0.06)",
        }}>
          {/* Card header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShelbyHexLogo size={20} />
              <span style={{ fontWeight: 600, fontSize: 14, color: textPrimary }}>
                {tx.fileListTitle}
              </span>
              {!loading && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "2px 8px",
                  borderRadius: 999, background: pinkDim, color: pink,
                }}>
                  {files.length}
                </span>
              )}
            </div>
            <button
              onClick={loadFiles}
              disabled={loading}
              style={{
                background: "none", border: `1px solid ${border}`,
                borderRadius: 8, color: textSecondary,
                cursor: loading ? "not-allowed" : "pointer",
                padding: "5px 14px", fontSize: 12, fontWeight: 500,
                transition: "all 0.15s",
              }}
            >
              {loading ? tx.refreshing : tx.refresh}
            </button>
          </div>

          {/* File rows */}
          {loading ? (
            <div style={{ padding: 56, textAlign: "center" }}>
              <div style={{ animation: "spin 1.5s linear infinite", display: "inline-block", marginBottom: 12 }}>
                <ShelbyHexLogo size={32} />
              </div>
              <p style={{ margin: 0, color: textMuted, fontSize: 14 }}>{tx.loadingList}</p>
            </div>
          ) : files.length === 0 ? (
            <div style={{ padding: 56, textAlign: "center" }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: pinkDim, border: `1.5px solid ${pinkDimBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, margin: "0 auto 16px",
              }}>
                📭
              </div>
              <p style={{ margin: "0 0 4px", color: textPrimary, fontSize: 15, fontWeight: 600 }}>{tx.emptyTitle}</p>
              <p style={{ margin: 0, color: textMuted, fontSize: 13 }}>{tx.emptyHint}</p>
            </div>
          ) : (
            files.map((file, i) => {
              const name = getFileName(file.blobName)
              const isLast = i === files.length - 1
              return (
                <div
                  key={file.blobName}
                  style={{
                    padding: "14px 20px",
                    borderBottom: isLast ? "none" : `1px solid ${border}`,
                    display: "flex", alignItems: "center", gap: 14,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = bgCardHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: pinkDim, border: `1px solid ${pinkDimBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>
                    {getFileIcon(name)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {name}
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                      {formatBytes(file.size)}
                      {file.expirationMicros && (
                        <>
                          <span style={{ color: borderStrong }}>·</span>
                          {tx.expires}: {new Date(file.expirationMicros / 1000).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")}
                        </>
                      )}
                      {!file.isWritten && (
                        <span style={{
                          fontSize: 11, padding: "1px 8px", borderRadius: 999,
                          background: "rgba(255,180,0,0.1)", color: "#D97706", fontWeight: 500,
                        }}>
                          {tx.processing}
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(file.blobName)}
                    disabled={downloading === file.blobName}
                    style={{
                      background: downloading === file.blobName ? pinkDim : pink,
                      border: "none",
                      borderRadius: 10,
                      color: downloading === file.blobName ? pink : "#fff",
                      cursor: downloading === file.blobName ? "not-allowed" : "pointer",
                      padding: "8px 16px",
                      fontSize: 13, fontWeight: 600,
                      flexShrink: 0,
                      transition: "all 0.15s",
                    }}
                  >
                    {downloading === file.blobName ? tx.downloading : `↓ ${tx.download}`}
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Stats bar */}
        {files.length > 0 && !loading && (
          <div style={{
            marginTop: 12, padding: "10px 20px",
            display: "flex", gap: 24,
            fontSize: 12, color: textMuted,
          }}>
            <span>{files.length} {lang === "vi" ? "file" : "files"}</span>
            <span>·</span>
            <span>{formatBytes(files.reduce((s, f) => s + f.size, 0))} {lang === "vi" ? "tổng" : "total"}</span>
            <span>·</span>
            <span style={{ color: pink }}>{files.filter(f => f.isWritten).length} {lang === "vi" ? "đã xác nhận" : "confirmed"}</span>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, paddingBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
            <ShelbyHexLogo size={16} />
            <span style={{ fontSize: 12, color: textMuted, fontWeight: 500 }}>Shelby Protocol</span>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: pinkLight }}>
            {tx.footer}
          </p>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  )
}
