"use client"

import { useState } from "react"
import { WalletButton } from "./WalletButton"

interface LandingPageProps {
  onLaunch: () => void
}

function ShelbyHexLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="#FF6FD8" opacity="0.12" stroke="#FF6FD8" strokeWidth="1.5" />
      <polygon points="20,8 31,14 31,26 20,32 9,26 9,14" fill="#FF6FD8" opacity="0.2" />
      <polygon points="20,13 27,17 27,23 20,27 13,23 13,17" fill="#FF6FD8" opacity="0.5" />
      <circle cx="20" cy="20" r="4.5" fill="#FF6FD8" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
    </svg>
  )
}

function NetworkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <circle cx="4" cy="6" r="2" />
      <circle cx="20" cy="6" r="2" />
      <circle cx="4" cy="18" r="2" />
      <circle cx="20" cy="18" r="2" />
      <line x1="6" y1="7" x2="10" y2="11" />
      <line x1="18" y1="7" x2="14" y2="11" />
      <line x1="6" y1="17" x2="10" y2="13" />
      <line x1="18" y1="17" x2="14" y2="13" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="15" rx="2" />
      <path d="M2 10h20" />
      <circle cx="17" cy="15" r="1.5" fill="#FF6FD8" stroke="none" />
    </svg>
  )
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const [lang, setLang] = useState<"en" | "vi">("en")

  const copy = {
    en: {
      tagline: "Decentralized Storage",
      hero: ["Store Files", "Beyond Limits"],
      heroSub: "Erasure-coded, wallet-gated file storage on the Shelby Protocol — powered by Aptos blockchain.",
      launch: "Launch App",
      learnMore: "Learn More",
      featuresTitle: "Why Shelby Vault",
      features: [
        { title: "Truly Decentralized", desc: "Files are erasure-coded across multiple nodes globally. No single point of failure, no central authority." },
        { title: "Wallet-Gated Access", desc: "Your vault is namespaced to your wallet address. Only you hold the keys to your files." },
        { title: "Blazing Fast", desc: "Built on Aptos — one of the fastest L1 blockchains. Sub-second finality for all operations." },
      ],
      stepsTitle: "How It Works",
      stepsSub: "Four simple steps to store your files on the decentralized web",
      steps: [
        { n: "01", title: "Connect Wallet", desc: "Connect your Petra wallet to identify your vault and namespace your files securely." },
        { n: "02", title: "Upload File", desc: "Drag & drop any file up to 100MB. We handle the encryption and distribution automatically." },
        { n: "03", title: "Distributed Globally", desc: "Your file is erasure-coded and spread across Shelby network nodes worldwide." },
        { n: "04", title: "Download Anytime", desc: "Retrieve your files from anywhere in the world, any time, as long as you hold your wallet." },
      ],
      ctaTitle: "Ready to own your storage?",
      ctaSub: "No sign-ups. No servers. Just your wallet and your files.",
      ctaBtn: "Open Vault →",
      network: "Shelbynet Testnet",
      footer: "Powered by Shelby Protocol · Aptos Blockchain",
      langLabel: "VI",
    },
    vi: {
      tagline: "Lưu Trữ Phi Tập Trung",
      hero: ["Lưu File", "Không Giới Hạn"],
      heroSub: "Lưu trữ file mã hoá erasure-coded, bảo vệ bằng wallet trên Shelby Protocol — vận hành bởi blockchain Aptos.",
      launch: "Mở App",
      learnMore: "Tìm hiểu thêm",
      featuresTitle: "Tại Sao Shelby Vault",
      features: [
        { title: "Thực Sự Phi Tập Trung", desc: "File được mã hoá erasure-coded và phân tán trên nhiều node toàn cầu. Không điểm thất bại đơn lẻ." },
        { title: "Bảo Mật Bằng Wallet", desc: "Vault được gắn với địa chỉ wallet của bạn. Chỉ bạn mới có quyền truy cập." },
        { title: "Tốc Độ Cao", desc: "Xây trên Aptos — một trong các L1 nhanh nhất. Xác nhận giao dịch dưới 1 giây." },
      ],
      stepsTitle: "Cách Hoạt Động",
      stepsSub: "Bốn bước đơn giản để lưu file lên web phi tập trung",
      steps: [
        { n: "01", title: "Kết Nối Wallet", desc: "Kết nối ví Petra để xác định vault và lưu file dưới địa chỉ của bạn." },
        { n: "02", title: "Upload File", desc: "Kéo thả file tối đa 100MB. Hệ thống tự động mã hoá và phân phối." },
        { n: "03", title: "Phân Tán Toàn Cầu", desc: "File được erasure-coded và trải đều trên các node Shelby network toàn thế giới." },
        { n: "04", title: "Tải Bất Cứ Lúc Nào", desc: "Truy xuất file từ bất kỳ đâu, bất kỳ lúc nào, chỉ cần giữ wallet của bạn." },
      ],
      ctaTitle: "Sẵn sàng sở hữu lưu trữ của bạn?",
      ctaSub: "Không đăng ký. Không server. Chỉ cần wallet và file của bạn.",
      ctaBtn: "Mở Vault →",
      network: "Shelbynet Testnet",
      footer: "Vận hành bởi Shelby Protocol · Blockchain Aptos",
      langLabel: "EN",
    },
  }[lang]

  const featureIcons = [<ShieldIcon key="s" />, <NetworkIcon key="n" />, <BoltIcon key="b" />]

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0A0118 0%, #0D0221 40%, #120330 100%)",
      color: "#F0E8FF",
      fontFamily: "'Inter', system-ui, sans-serif",
      overflowX: "hidden",
    }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes aurora1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.08); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.05); }
        }
        @keyframes aurora3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.06); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,111,216,0.3); }
          50% { box-shadow: 0 0 0 12px rgba(255,111,216,0); }
        }
        .launch-btn {
          transition: all 0.2s ease;
        }
        .launch-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255,111,216,0.45) !important;
        }
        .secondary-btn:hover {
          background: rgba(255,111,216,0.08) !important;
          border-color: rgba(255,111,216,0.4) !important;
        }
        .feature-card:hover {
          border-color: rgba(255,111,216,0.35) !important;
          background: rgba(255,111,216,0.06) !important;
          transform: translateY(-4px);
        }
        .feature-card { transition: all 0.25s ease; }
        .step-card:hover { border-color: rgba(255,111,216,0.3) !important; }
        .step-card { transition: border-color 0.2s ease; }
      `}</style>

      {/* Aurora background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-20%", left: "10%",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "aurora1 12s ease-in-out infinite",
          filter: "blur(1px)",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "-10%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(255,111,216,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "aurora2 15s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "30%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "aurora3 10s ease-in-out infinite",
        }} />
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,111,216,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,111,216,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,1,24,0.75)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,111,216,0.1)",
        padding: "0 40px",
        height: 68,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <ShelbyHexLogo size={34} />
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", color: "#F0E8FF" }}>
          Shelby <span style={{ color: "#FF6FD8" }}>Vault</span>
        </span>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            fontSize: 12, padding: "5px 12px", borderRadius: 999,
            background: "rgba(255,111,216,0.08)",
            border: "1px solid rgba(255,111,216,0.2)",
            color: "#FF6FD8", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6FD8", display: "inline-block", animation: "pulse-ring 2s infinite" }} />
            {copy.network}
          </div>
          <button onClick={() => setLang(l => l === "vi" ? "en" : "vi")} style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999, color: "rgba(240,232,255,0.7)",
            cursor: "pointer", padding: "5px 14px",
            fontSize: 12, fontWeight: 600,
          }}>
            {lang === "vi" ? "🇻🇳" : "🇺🇸"} {copy.langLabel}
          </button>
          <WalletButton />
          <button onClick={onLaunch} className="launch-btn" style={{
            background: "linear-gradient(135deg, #FF6FD8 0%, #C084FC 100%)",
            border: "none", borderRadius: 999,
            color: "#fff", cursor: "pointer",
            padding: "8px 20px", fontSize: 14, fontWeight: 600,
            boxShadow: "0 4px 20px rgba(255,111,216,0.3)",
          }}>
            {copy.launch}
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", zIndex: 1,
        maxWidth: 860, margin: "0 auto",
        padding: "100px 24px 80px",
        textAlign: "center",
        animation: "fadeInUp 0.7s ease both",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 13, fontWeight: 500,
          padding: "6px 16px", borderRadius: 999,
          background: "rgba(255,111,216,0.08)",
          border: "1px solid rgba(255,111,216,0.2)",
          color: "#FF6FD8", marginBottom: 32,
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          <ShelbyHexLogo size={16} />
          {copy.tagline}
        </div>

        <h1 style={{
          margin: "0 0 24px",
          fontSize: "clamp(48px, 8vw, 80px)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          color: "#F0E8FF",
        }}>
          {copy.hero[0]}{" "}
          <span style={{
            background: "linear-gradient(135deg, #FF6FD8 0%, #C084FC 50%, #818CF8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {copy.hero[1]}
          </span>
        </h1>

        <p style={{
          margin: "0 auto 40px",
          maxWidth: 540,
          fontSize: 18,
          lineHeight: 1.65,
          color: "rgba(240,232,255,0.6)",
          fontWeight: 400,
        }}>
          {copy.heroSub}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <button onClick={onLaunch} className="launch-btn" style={{
            background: "linear-gradient(135deg, #FF6FD8 0%, #C084FC 100%)",
            border: "none", borderRadius: 14,
            color: "#fff", cursor: "pointer",
            padding: "14px 36px", fontSize: 16, fontWeight: 700,
            boxShadow: "0 8px 32px rgba(255,111,216,0.35)",
            letterSpacing: "-0.01em",
          }}>
            {copy.launch} →
          </button>
          <a href="#how-it-works" style={{ textDecoration: "none" }}>
            <button className="secondary-btn" style={{
              background: "transparent",
              border: "1px solid rgba(255,111,216,0.25)",
              borderRadius: 14,
              color: "rgba(240,232,255,0.8)", cursor: "pointer",
              padding: "14px 32px", fontSize: 16, fontWeight: 600,
              transition: "all 0.2s",
            }}>
              {copy.learnMore}
            </button>
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 48,
          marginTop: 72,
          paddingTop: 40,
          borderTop: "1px solid rgba(255,111,216,0.1)",
          flexWrap: "wrap",
        }}>
          {[
            { v: "100MB", l: "Max file size" },
            { v: "Aptos", l: "Blockchain" },
            { v: "∞", l: "No sign-up" },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#FF6FD8", letterSpacing: "-0.03em" }}>{v}</div>
              <div style={{ fontSize: 13, color: "rgba(240,232,255,0.4)", marginTop: 4, fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 1040, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{
            margin: "0 0 12px",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700, letterSpacing: "-0.03em", color: "#F0E8FF",
          }}>
            {copy.featuresTitle}
          </h2>
          <div style={{ width: 40, height: 3, background: "linear-gradient(90deg, #FF6FD8, #C084FC)", borderRadius: 2, margin: "0 auto" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {copy.features.map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: "rgba(255,111,216,0.03)",
              border: "1px solid rgba(255,111,216,0.12)",
              borderRadius: 20,
              padding: "32px 28px",
              cursor: "default",
            }}>
              <div style={{
                width: 52, height: 52,
                background: "rgba(255,111,216,0.1)",
                border: "1px solid rgba(255,111,216,0.2)",
                borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}>
                {featureIcons[i]}
              </div>
              <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "#F0E8FF", letterSpacing: "-0.02em" }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "rgba(240,232,255,0.5)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{
            margin: "0 0 12px",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700, letterSpacing: "-0.03em", color: "#F0E8FF",
          }}>
            {copy.stepsTitle}
          </h2>
          <p style={{ margin: 0, color: "rgba(240,232,255,0.5)", fontSize: 15 }}>{copy.stepsSub}</p>
          <div style={{ width: 40, height: 3, background: "linear-gradient(90deg, #FF6FD8, #C084FC)", borderRadius: 2, margin: "16px auto 0" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {copy.steps.map((step, i) => {
            const stepIcons = [<WalletIcon key="w" />, null, <NetworkIcon key="n" />, null]
            return (
              <div key={i} className="step-card" style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,111,216,0.1)",
                borderRadius: 20,
                padding: "28px 24px",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Connecting line (not on last) */}
                {i < copy.steps.length - 1 && (
                  <div style={{
                    position: "absolute", top: 42, right: -8, width: 16, height: 2,
                    background: "linear-gradient(90deg, rgba(255,111,216,0.4), transparent)",
                    display: "none", // hidden on small screens via grid
                  }} />
                )}
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: "#FF6FD8", letterSpacing: "0.08em",
                  marginBottom: 16, fontFamily: "monospace",
                  opacity: 0.8,
                }}>
                  STEP {step.n}
                </div>
                <div style={{
                  width: 44, height: 44,
                  background: "linear-gradient(135deg, rgba(255,111,216,0.15), rgba(192,132,252,0.1))",
                  border: "1px solid rgba(255,111,216,0.25)",
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                  fontSize: 20,
                }}>
                  {["🔗", "📁", "🌐", "⬇️"][i]}
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#F0E8FF", letterSpacing: "-0.02em" }}>
                  {step.title}
                </h3>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(240,232,255,0.45)" }}>
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(255,111,216,0.1) 0%, rgba(192,132,252,0.08) 100%)",
          border: "1px solid rgba(255,111,216,0.2)",
          borderRadius: 28,
          padding: "56px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400, height: 200,
            background: "radial-gradient(ellipse, rgba(255,111,216,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <h2 style={{
            margin: "0 0 12px",
            fontSize: "clamp(24px, 3.5vw, 36px)",
            fontWeight: 800, letterSpacing: "-0.03em",
            color: "#F0E8FF",
            position: "relative",
          }}>
            {copy.ctaTitle}
          </h2>
          <p style={{ margin: "0 0 32px", color: "rgba(240,232,255,0.5)", fontSize: 16, position: "relative" }}>
            {copy.ctaSub}
          </p>
          <button onClick={onLaunch} className="launch-btn" style={{
            background: "linear-gradient(135deg, #FF6FD8 0%, #C084FC 100%)",
            border: "none", borderRadius: 14,
            color: "#fff", cursor: "pointer",
            padding: "14px 40px", fontSize: 16, fontWeight: 700,
            boxShadow: "0 8px 32px rgba(255,111,216,0.35)",
            letterSpacing: "-0.01em",
            position: "relative",
          }}>
            {copy.ctaBtn}
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(255,111,216,0.08)",
        padding: "28px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShelbyHexLogo size={22} />
          <span style={{ fontSize: 13, color: "rgba(240,232,255,0.35)", fontWeight: 500 }}>
            Shelby Vault
          </span>
        </div>
        <span style={{ fontSize: 12, color: "rgba(240,232,255,0.25)" }}>{copy.footer}</span>
        <span style={{ fontSize: 12, color: "rgba(240,232,255,0.25)" }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
