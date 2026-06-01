import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shelby Vault",
  description: "Decentralized file storage powered by Shelby Protocol",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
