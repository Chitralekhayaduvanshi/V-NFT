"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Download, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface NFTPosition {
  id: string
  token0: string
  token1: string
  fee: number
  lp_tokens: number
  accumulated_fees_a: number
  accumulated_fees_b: number
  impermanent_loss: number
  position_value: number
  entry_price_a: number
  current_price_a: number
  created_at: string
}

export function NFTPositionViewer() {
  const [selectedPosition, setSelectedPosition] = useState<NFTPosition | null>(null)
  const [showMetadata, setShowMetadata] = useState(true)

  const positions: NFTPosition[] = [
    {
      id: "nft-1",
      token0: "SUI",
      token1: "USDC",
      fee: 0.3,
      lp_tokens: 5000,
      accumulated_fees_a: 12.5,
      accumulated_fees_b: 35.75,
      impermanent_loss: -1.2,
      position_value: 14250,
      entry_price_a: 2.8,
      current_price_a: 2.85,
      created_at: "2024-11-15",
    },
  ]

  const position = selectedPosition || positions[0]

  // Calculate metadata string (dynamic)
  const metadata = `Pool: ${position.token0}/${position.token1} | Fee: ${position.fee}% | LP: ${position.lp_tokens.toLocaleString()} | Value: $${position.position_value.toLocaleString()}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">LP NFT Position Viewer</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowMetadata(!showMetadata)} className="w-10 h-10 p-0">
          {showMetadata ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
      </div>

      <Card className="p-6 bg-card border-border/40 overflow-hidden">
        {/* NFT Visual Representation */}
        <div className="bg-gradient-to-br from-background via-background to-accent/5 rounded-lg p-8 mb-6 border border-border/40 aspect-square flex flex-col items-center justify-center space-y-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center text-white font-bold">
              {position.token0.charAt(0)}
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/60 rounded-lg flex items-center justify-center text-white font-bold">
              {position.token1.charAt(0)}
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">LP Position #{position.id.slice(-3)}</p>
            <p className="text-2xl font-bold text-foreground">
              {position.token0}/{position.token1}
            </p>
            <Badge variant="secondary" className="mt-2">
              {position.fee}% Fee
            </Badge>
          </div>
        </div>

        {showMetadata && (
          <div className="space-y-4 mb-6 p-4 bg-background rounded-lg border border-border/40">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Dynamic Metadata</p>
              <p className="text-sm text-foreground break-all">{metadata}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => navigator.clipboard.writeText(metadata)}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        )}

        {/* Position Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-background rounded-lg border border-border/40">
            <p className="text-xs text-muted-foreground mb-1">Position Value</p>
            <p className="text-lg font-bold text-foreground">${position.position_value.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-background rounded-lg border border-border/40">
            <p className="text-xs text-muted-foreground mb-1">LP Tokens</p>
            <p className="text-lg font-bold text-foreground">{position.lp_tokens.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-background rounded-lg border border-border/40">
            <p className="text-xs text-muted-foreground mb-1">Accumulated Fees</p>
            <p className="text-lg font-bold text-accent">
              {position.accumulated_fees_a.toFixed(2)} {position.token0}
            </p>
            <p className="text-xs text-accent/80">
              {position.accumulated_fees_b.toFixed(2)} {position.token1}
            </p>
          </div>
          <div className="p-3 bg-background rounded-lg border border-border/40">
            <p className="text-xs text-muted-foreground mb-1">Impermanent Loss</p>
            <p className={`text-lg font-bold ${position.impermanent_loss < 0 ? "text-destructive" : "text-accent"}`}>
              {position.impermanent_loss.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="p-3 bg-background rounded-lg border border-border/40 mb-6">
          <p className="text-xs text-muted-foreground mb-3">Price Movement</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Entry Price</p>
              <p className="font-semibold text-foreground">${position.entry_price_a.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Badge variant="outline">
                  {position.current_price_a > position.entry_price_a ? "+" : ""}
                  {((position.current_price_a / position.entry_price_a - 1) * 100).toFixed(2)}%
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Price</p>
              <p className="font-semibold text-foreground">${position.current_price_a.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Created At */}
        <div className="text-xs text-muted-foreground text-center p-3 border-t border-border/40">
          Position created on {position.created_at}
        </div>

        {/* Export Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 bg-transparent" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export NFT
          </Button>
          <Button className="flex-1 bg-accent hover:bg-accent/90" size="sm">
            Claim Fees
          </Button>
        </div>
      </Card>
    </div>
  )
}
