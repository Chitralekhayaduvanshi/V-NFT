"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <nav className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AMM</span>
          </div>
          <span className="font-bold text-lg text-foreground hidden md:inline">SUI AMM</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#pools" className="text-sm text-muted-foreground hover:text-foreground transition">
            Pools
          </a>
          <a href="#swap" className="text-sm text-muted-foreground hover:text-foreground transition">
            Swap
          </a>
          <a href="#positions" className="text-sm text-muted-foreground hover:text-foreground transition">
            Positions
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
          <Button size="sm" className="bg-accent hover:bg-accent/90">
            Launch App
          </Button>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg transition">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>
    </header>
  )
}
