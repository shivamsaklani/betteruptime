"use client"

import type React from "react"

import Link from "next/link"
import { Activity, BarChart3, Shield, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  linkText: string
  linkHref: string
}

export function AuthLayout({ children, title, subtitle, linkText, linkHref }: AuthLayoutProps) {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor your website performance with detailed insights and reports.",
    },
    {
      icon: Shield,
      title: "99.9% Uptime",
      description: "Reliable monitoring with global infrastructure and instant alerts.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get notified within 30 seconds when your website goes down.",
    },
  ]

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-xl sm:text-2xl font-bold">BetterUptime</span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground text-balance">{subtitle}</p>
            </div>

            {children}

            <div className="text-center">
              <Link href={linkHref} className="text-sm text-primary hover:text-primary/80">
                {linkText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:block relative bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-8 xl:px-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl xl:text-3xl font-bold text-balance">Monitor your websites with confidence</h3>
              <p className="mt-4 text-base xl:text-lg text-muted-foreground text-balance">
                Join thousands of businesses that trust BetterUptime to keep their websites running smoothly.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{feature.title}</h4>
                    <p className="text-muted-foreground text-balance">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <div className="grid grid-cols-3 gap-4 xl:gap-8 text-center">
                <div>
                  <div className="text-xl xl:text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-xs xl:text-sm text-muted-foreground">Uptime</div>
                </div>
                <div>
                  <div className="text-xl xl:text-2xl font-bold text-primary">&lt; 30s</div>
                  <div className="text-xs xl:text-sm text-muted-foreground">Alert Time</div>
                </div>
                <div>
                  <div className="text-xl xl:text-2xl font-bold text-primary">10k+</div>
                  <div className="text-xs xl:text-sm text-muted-foreground">Websites</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
