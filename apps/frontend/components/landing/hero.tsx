"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-primary/20 bg-primary/5"
          >
            Trusted by 10,000+ websites worldwide
          </Badge>

          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-balance leading-tight">
              Monitor Your Website
              <br className="hidden sm:inline" />
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Uptime & Performance
              </span>
            </h1>

            <p className="mx-auto max-w-[600px] sm:max-w-[700px] text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed text-balance px-4 sm:px-0">
              Get instant alerts when your website goes down. Monitor performance, track uptime, and ensure your users
              always have the best experience with our comprehensive monitoring solution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center px-4 sm:px-0">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              asChild
            >
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-11 text-base font-semibold bg-transparent hover:bg-accent/50 transition-all duration-200"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
