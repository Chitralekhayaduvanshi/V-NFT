"use client"

import { useState } from "react"
import { PoolBrowser } from "./pool-browser"
import { SwapPanel } from "./swap-panel"
import { PositionsPanel } from "./positions-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PoolStats } from "./pool-stats"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("swap")

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Stats Overview */}
      <PoolStats />

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <PoolBrowser />
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="swap">Swap</TabsTrigger>
              <TabsTrigger value="positions">My Positions</TabsTrigger>
            </TabsList>

            <TabsContent value="swap" className="space-y-4">
              <SwapPanel />
            </TabsContent>

            <TabsContent value="positions" className="space-y-4">
              <PositionsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
