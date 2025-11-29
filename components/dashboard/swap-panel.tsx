"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDownUp, Settings } from "lucide-react"
import { useState } from "react"

export function SwapPanel() {
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")

  const handleSwap = () => {
    console.log("Swap executed:", { fromAmount, toAmount, slippage })
  }

  const priceImpact = 0.23
  const minimumReceived = toAmount
    ? (Number.parseFloat(toAmount) * (1 - Number.parseFloat(slippage) / 100)).toFixed(6)
    : "0"

  return (
    <Card className="p-6 bg-card border-border/40">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Swap Tokens</h2>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* From */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">From</label>
          <div className="bg-background rounded-lg p-4 border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent text-2xl font-semibold outline-none text-foreground placeholder:text-muted-foreground w-full"
              />
              <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-lg border border-border/40">
                <div className="w-5 h-5 bg-gradient-to-br from-accent to-accent/60 rounded-full" />
                <span className="text-sm font-medium">SUI</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Balance: 125.50 SUI</p>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 rounded-full p-0 bg-background hover:bg-muted border-2 border-card"
            onClick={() => {
              const temp = fromAmount
              setFromAmount(toAmount)
              setToAmount(temp)
            }}
          >
            <ArrowDownUp className="w-4 h-4" />
          </Button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">To</label>
          <div className="bg-background rounded-lg p-4 border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <input
                type="number"
                placeholder="0.00"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="bg-transparent text-2xl font-semibold outline-none text-foreground placeholder:text-muted-foreground w-full"
              />
              <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-lg border border-border/40">
                <div className="w-5 h-5 bg-gradient-to-br from-secondary to-secondary/60 rounded-full" />
                <span className="text-sm font-medium">USDC</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Balance: 450.00 USDC</p>
          </div>
        </div>

        {/* Details */}
        <div className="bg-background rounded-lg p-4 space-y-3 border border-border/40">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price Impact</span>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">{priceImpact.toFixed(2)}%</span>
              {priceImpact > 1 && (
                <Badge variant="destructive" className="text-xs">
                  High
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Minimum Received</span>
            <span className="text-foreground font-medium">{minimumReceived} USDC</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-3 border-t border-border/40">
            <span className="text-muted-foreground">Exchange Rate</span>
            <span className="text-foreground font-medium">1 SUI = 2.85 USDC</span>
          </div>
        </div>

        <Button className="w-full bg-accent hover:bg-accent/90 text-white" onClick={handleSwap}>
          Swap Tokens
        </Button>
      </div>
    </Card>
  )
}
