"use client"

import { Header } from "@/components/layout/header"
import { AdvancedPoolCreation } from "@/components/dashboard/advanced-pool-creation"
import { NFTPositionViewer } from "@/components/dashboard/nft-position-viewer"
import { ImpermanentLossChart } from "@/components/dashboard/impermanent-loss-chart"
import { FeeTierComparison } from "@/components/dashboard/fee-tier-comparison"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdvancedDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Analytics</h1>
          <p className="text-muted-foreground">Explore NFT positions, fee strategies, and impermanent loss analysis</p>
        </div>

        <Tabs defaultValue="nft" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nft">NFT Positions</TabsTrigger>
            <TabsTrigger value="analysis">Analytics</TabsTrigger>
            <TabsTrigger value="pools">Pool Management</TabsTrigger>
          </TabsList>

          <TabsContent value="nft" className="space-y-6">
            <NFTPositionViewer />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImpermanentLossChart />
              <FeeTierComparison />
            </div>
          </TabsContent>

          <TabsContent value="pools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card border-border/40 lg:col-span-2">
                <AdvancedPoolCreation />
              </Card>

              <Card className="p-6 bg-card border-border/40">
                <h3 className="font-semibold mb-4 text-foreground">Available Fee Tiers</h3>
                <div className="space-y-3">
                  {[
                    { tier: "0.05%", use: "Stablecoins", tvl: "$2.1M" },
                    { tier: "0.3%", use: "Standard Pairs", tvl: "$8.5M" },
                    { tier: "1%", use: "High Volatility", tvl: "$1.8M" },
                  ].map((item) => (
                    <div
                      key={item.tier}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/40"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.tier}</p>
                        <p className="text-xs text-muted-foreground">{item.use}</p>
                      </div>
                      <p className="font-semibold text-accent">{item.tvl}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border/40">
                <h3 className="font-semibold mb-4 text-foreground">Pool Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Dynamic NFT metadata
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Auto-compounding fees
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Concentrated liquidity
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Flash loan support
                  </li>
                </ul>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
