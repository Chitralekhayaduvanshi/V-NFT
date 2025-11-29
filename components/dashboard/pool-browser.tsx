"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { useState } from "react"

interface Pool {
  id: string
  token0: string
  token1: string
  fee: number
  tvl: string
  volume24h: string
  apr: number
}

export function PoolBrowser() {
  const [searchTerm, setSearchTerm] = useState("")

  const pools: Pool[] = [
    {
      id: "1",
      token0: "SUI",
      token1: "USDC",
      fee: 0.3,
      tvl: "$1.2M",
      volume24h: "$450K",
      apr: 12.5,
    },
    {
      id: "2",
      token0: "SUI",
      token1: "USDT",
      fee: 0.05,
      tvl: "$850K",
      volume24h: "$320K",
      apr: 8.3,
    },
    {
      id: "3",
      token0: "USDC",
      token1: "USDT",
      fee: 0.01,
      tvl: "$950K",
      volume24h: "$280K",
      apr: 4.2,
    },
  ]

  const filteredPools = pools.filter(
    (p) =>
      p.token0.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.token1.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="p-6 bg-card border-border/40">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Liquidity Pools</h2>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search pools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border/40"
          />
        </div>

        <div className="space-y-2">
          {filteredPools.map((pool) => (
            <div
              key={pool.id}
              className="p-3 bg-background rounded-lg border border-border/40 hover:border-border/60 cursor-pointer transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {pool.token0.charAt(0)}
                    </div>
                    <div className="w-6 h-6 bg-gradient-to-br from-secondary to-secondary/60 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {pool.token1.charAt(0)}
                    </div>
                  </div>
                  <span className="font-medium text-sm text-foreground">
                    {pool.token0}/{pool.token1}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {pool.fee}%
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>TVL: {pool.tvl}</div>
                <div>APR: {pool.apr.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
