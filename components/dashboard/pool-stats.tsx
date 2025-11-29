"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function PoolStats() {
  const stats = [
    {
      label: "Total Value Locked",
      value: "$2.4M",
      change: "+12.5%",
      icon: <TrendingUp className="w-4 h-4 text-accent" />,
    },
    {
      label: "24h Volume",
      value: "$1.2M",
      change: "+8.2%",
      icon: <TrendingUp className="w-4 h-4 text-accent" />,
    },
    {
      label: "Active Pools",
      value: "12",
      change: "+2",
      icon: <TrendingUp className="w-4 h-4 text-accent" />,
    },
    {
      label: "Average Fee Tier",
      value: "0.3%",
      change: "Standard",
      icon: <TrendingUp className="w-4 h-4 text-accent" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 bg-card border-border/40 hover:border-border/60 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-accent mt-2">{stat.change}</p>
            </div>
            <div className="p-2 bg-accent/10 rounded-lg">{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
