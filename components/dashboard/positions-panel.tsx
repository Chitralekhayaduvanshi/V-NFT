"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface Position {
  id: string
  token0: string
  token1: string
  fee: number
  liquidity: string
  value: string
  feesEarned: string
}

export function PositionsPanel() {
  const positions: Position[] = [
    {
      id: "pos-1",
      token0: "SUI",
      token1: "USDC",
      fee: 0.3,
      liquidity: "5,000 LP",
      value: "$14,250",
      feesEarned: "$128.50",
    },
    {
      id: "pos-2",
      token0: "USDC",
      token1: "USDT",
      fee: 0.01,
      liquidity: "10,000 LP",
      value: "$10,000",
      feesEarned: "$45.20",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Positions</h2>
        <Button size="sm" className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Liquidity
        </Button>
      </div>

      {positions.length === 0 ? (
        <Card className="p-12 bg-card border-border/40 text-center">
          <p className="text-muted-foreground">No positions yet. Add liquidity to get started.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {positions.map((position) => (
            <Card key={position.id} className="p-4 bg-card border-border/40 hover:border-border/60 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {position.token0.charAt(0)}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary/60 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {position.token1.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {position.token0}/{position.token1}
                    </p>
                    <p className="text-xs text-muted-foreground">{position.liquidity}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {position.fee}%
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-background rounded-lg border border-border/40">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Position Value</p>
                  <p className="font-semibold text-foreground">{position.value}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fees Earned</p>
                  <p className="font-semibold text-accent">{position.feesEarned}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">IL Est.</p>
                  <p className="font-semibold text-foreground">-1.2%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-sm bg-transparent" size="sm">
                  Claim Fees
                </Button>
                <Button variant="outline" className="flex-1 text-sm bg-transparent" size="sm">
                  Manage
                </Button>
                <Button variant="outline" size="sm" className="w-10 p-0 bg-transparent">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
