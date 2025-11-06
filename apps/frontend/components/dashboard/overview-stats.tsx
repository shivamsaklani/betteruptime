"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface Website {
  id: string
  name: string
  url: string
  status: "up" | "down" | "degraded"
  uptime: number
  responseTime: number
  lastChecked: string
}

interface OverviewStatsProps {
  websites: Website[]
}

export function OverviewStats({ websites }: OverviewStatsProps) {
  const totalWebsites = websites.length
  const upWebsites = websites.filter((w) => w.status === "up").length
  const downWebsites = websites.filter((w) => w.status === "down").length
  const degradedWebsites = websites.filter((w) => w.status === "degraded").length
  const avgResponseTime = websites.length
    ? Math.round(websites.reduce((sum, w) => sum + w.responseTime, 0) / websites.length)
    : 0

  const stats = [
    {
      title: "Total Websites",
      value: totalWebsites,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Online",
      value: upWebsites,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Issues",
      value: downWebsites + degradedWebsites,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      title: "Avg Response",
      value: `${avgResponseTime}ms`,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">
              {stat.title}
            </CardTitle>
            <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor} transition-colors`}>
              <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
