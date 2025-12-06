"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Activity, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

       <div className="flex h-16 max-full justify-between md:justify-around items-center ">
        <div className="mr-4 ml-2 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Activity className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">BetterUptime</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#features">
              Features
            </Link>
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#pricing">
              Pricing
            </Link>
            <Link className="tra  id: string;  nsition-colors hover:text-foreground/80 text-foreground/60" href="#about">
              About
            </Link>
          </nav>
        </div>

        <div className="flex  items-center justify-between space-x-2 md:justify-end">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="hidden md:flex items-center space-x-2">
           
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
              <ThemeToggle />
          </div>
         
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t  border-border bg-background/95 backdrop-blur">
          <div className="container py-4 px-3 space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link
                className="text-sm font-medium transition-colors hover:text-primary"
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                className="text-sm font-medium transition-colors hover:text-primary"
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                className="text-sm font-medium transition-colors hover:text-primary"
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </nav>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
