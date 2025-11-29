import { Header } from "@/components/layout/header"
import { Dashboard } from "@/components/dashboard/dashboard"

export const metadata = {
  title: "SUI AMM - Decentralized Exchange",
  description: "Automated Market Maker with NFT LP Positions",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Header />
      <Dashboard />
    </main>
  )
}
