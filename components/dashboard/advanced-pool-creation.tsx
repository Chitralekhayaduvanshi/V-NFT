"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Info } from "lucide-react"
import { useState } from "react"

export function AdvancedPoolCreation() {
  const [isOpen, setIsOpen] = useState(false)
  const [poolType, setPoolType] = useState("volatile")
  const [feeLevel, setFeeLevel] = useState("0.3")
  const [amplification, setAmplification] = useState("100")

  const feeOptions = [
    { value: "0.05", label: "0.05% - Best for stables", apr: "~2.5%" },
    { value: "0.3", label: "0.3% - Standard", apr: "~8-12%" },
    { value: "1", label: "1% - High volatility", apr: "~15-25%" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create New Pool
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card border-border/40">
        <DialogHeader>
          <DialogTitle>Create Liquidity Pool</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pool Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Pool Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "volatile", label: "Volatile", desc: "Standard AMM pairs" },
                { id: "stable", label: "Stable", desc: "Stablecoins/Wrapped assets" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPoolType(type.id)}
                  className={`p-3 rounded-lg border-2 transition text-left ${
                    poolType === type.id ? "border-accent bg-accent/10" : "border-border/40 hover:border-border/60"
                  }`}
                >
                  <p className="font-medium text-sm">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Token Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Token Pair</label>
            <div className="grid grid-cols-2 gap-2">
              <Select>
                <SelectTrigger className="bg-background border-border/40">
                  <SelectValue placeholder="Token A" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sui">SUI</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-background border-border/40">
                  <SelectValue placeholder="Token B" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                  <SelectItem value="sui">SUI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fee Tier Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Fee Tier</label>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {feeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFeeLevel(option.value)}
                  className={`w-full p-3 rounded-lg border-2 transition text-left ${
                    feeLevel === option.value ? "border-accent bg-accent/10" : "border-border/40 hover:border-border/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{option.label}</p>
                    <Badge variant="secondary" className="text-xs">
                      {option.apr}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stable Pool Options */}
          {poolType === "stable" && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Amplification Coefficient</label>
              <Input
                type="number"
                value={amplification}
                onChange={(e) => setAmplification(e.target.value)}
                className="bg-background border-border/40"
                min="1"
                max="10000"
              />
              <p className="text-xs text-muted-foreground">
                Higher values = tighter price range, lower slippage for similar prices
              </p>
            </div>
          )}

          {/* Initial Liquidity */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Initial Liquidity</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Token A Amount</p>
                <Input placeholder="0.00" className="bg-background border-border/40" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Token B Amount</p>
                <Input placeholder="0.00" className="bg-background border-border/40" />
              </div>
            </div>
          </div>

          <Button className="w-full bg-accent hover:bg-accent/90">Create Pool</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
