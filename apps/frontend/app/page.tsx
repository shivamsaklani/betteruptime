"use client"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Stats } from "@/components/landing/stats"
import { Pricing } from "@/components/landing/pricing"
import { CTA } from "@/components/landing/cta"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ThemeToggle } from "@/components/theme-toggle"
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col">
        <Hero />
        <Stats />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
