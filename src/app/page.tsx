"use client"

import { useState } from "react"
import LandingPage from "@/components/LandingPage"
import FileVault from "@/components/FileVault"

export default function Home() {
  const [showVault, setShowVault] = useState(false)

  if (showVault) return <FileVault onBack={() => setShowVault(false)} />
  return <LandingPage onLaunch={() => setShowVault(true)} />
}
