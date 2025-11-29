"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function ImpermanentLossChart() {
  // Simulated IL data across different price ratios
  const data = [
    { priceRatio: 0.5, il: -24.2, fee: 2.5, net: -21.7 },
    { priceRatio: 0.7, il: -9.8, fee: 3.2, net: -6.6 },
    { priceRatio: 0.85, il: -3.8, fee: 3.8, net: 0 },
    { priceRatio: 1.0, il: 0, fee: 4.2, net: 4.2 },
    { priceRatio: 1.15, il: -3.8, fee: 3.8, net: 0 },
    { priceRatio: 1.3, il: -9.8, fee: 3.2, net: -6.6 },
    { priceRatio: 1.5, il: -24.2, fee: 2.5, net: -21.7 },
  ]

  return (
    <Card className="p-6 bg-card border-border/40">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Impermanent Loss Analysis</h3>
          <p className="text-sm text-muted-foreground">Expected IL vs Fee Earnings at different price ratios</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3038" />
            <XAxis
              dataKey="priceRatio"
              stroke="#8a92a0"
              label={{ value: "Price Ratio", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis stroke="#8a92a0" label={{ value: "IL %", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1f26",
                border: "1px solid #2a3038",
                borderRadius: "0.5rem",
              }}
              cursor={{ stroke: "#6366f1" }}
            />
            <Line
              type="monotone"
              dataKey="il"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", r: 4 }}
              name="Impermanent Loss"
            />
            <Line
              type="monotone"
              dataKey="fee"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: "#22c55e", r: 4 }}
              name="Fee Earnings"
            />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: "#6366f1", r: 4 }}
              name="Net P&L"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="p-2 bg-background rounded border border-border/40">
            <p className="text-muted-foreground text-xs mb-1">At 1x Price</p>
            <p className="font-semibold text-accent">+4.2% Fee</p>
          </div>
          <div className="p-2 bg-background rounded border border-border/40">
            <p className="text-muted-foreground text-xs mb-1">At 1.5x Price</p>
            <p className="font-semibold text-destructive">-21.7% Net</p>
          </div>
          <div className="p-2 bg-background rounded border border-border/40">
            <p className="text-muted-foreground text-xs mb-1">Breakeven Range</p>
            <p className="font-semibold text-foreground">0.8-1.2x</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
