"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function FeeTierComparison() {
  const data = [
    {
      name: "Stable/Stable",
      "0.01%": 2.1,
      "0.05%": 10.5,
      "0.3%": 15.2,
    },
    {
      name: "Volatile",
      "0.01%": 0.5,
      "0.05%": 4.2,
      "0.3%": 12.8,
    },
    {
      name: "High Volatility",
      "0.01%": 0.1,
      "0.05%": 1.5,
      "0.3%": 8.3,
    },
  ]

  return (
    <Card className="p-6 bg-card border-border/40">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Fee Tier Comparison</h3>
          <p className="text-sm text-muted-foreground">Expected annual APR by pool type and fee tier</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3038" />
            <XAxis dataKey="name" stroke="#8a92a0" />
            <YAxis stroke="#8a92a0" label={{ value: "APR %", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1f26",
                border: "1px solid #2a3038",
                borderRadius: "0.5rem",
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
            />
            <Legend />
            <Bar dataKey="0.01%" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="0.05%" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="0.3%" fill="#ec4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-3">
          {[
            { tier: "0.01%", use: "Stablecoins", best: "Ultra-low slippage" },
            { tier: "0.3%", use: "Standard", best: "Balanced returns" },
            { tier: "1%", use: "High Vol", best: "Maximum rewards" },
          ].map((item) => (
            <div key={item.tier} className="p-3 bg-background rounded-lg border border-border/40">
              <Badge className="mb-2">{item.tier}</Badge>
              <p className="text-xs text-muted-foreground mb-1">{item.use}</p>
              <p className="text-xs font-medium text-foreground">{item.best}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
