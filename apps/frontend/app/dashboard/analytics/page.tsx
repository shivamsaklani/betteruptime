"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, Download, TrendingUp, Clock, Zap, Globe, AlertTriangle } from "lucide-react"
import { UptimeChart } from "@/components/dashboard/uptime-chart"
import PageHeader from "@/components/custom/pageheader"

// Mock analytics data
const performanceData = [
  { date: "2024-01-01", uptime: 99.9, responseTime: 245, requests: 12450 },
  { date: "2024-01-02", uptime: 99.8, responseTime: 189, requests: 13200 },
  { date: "2024-01-03", uptime: 99.9, responseTime: 267, requests: 11800 },
  { date: "2024-01-04", uptime: 99.7, responseTime: 423, requests: 14100 },
  { date: "2024-01-05", uptime: 99.9, responseTime: 298, requests: 13500 },
  { date: "2024-01-06", uptime: 99.8, responseTime: 234, requests: 12900 },
  { date: "2024-01-07", uptime: 99.9, responseTime: 201, requests: 13800 },
]

const incidentData = [
  { month: "Jan", incidents: 2, downtime: 45 },
  { month: "Feb", incidents: 1, downtime: 12 },
  { month: "Mar", incidents: 3, downtime: 78 },
  { month: "Apr", incidents: 0, downtime: 0 },
  { month: "May", incidents: 2, downtime: 34 },
  { month: "Jun", incidents: 1, downtime: 23 },
]

const statusDistribution = [
  { name: "Online", value: 85, color: "#10b981" },
  { name: "Degraded", value: 12, color: "#f59e0b" },
  { name: "Down", value: 3, color: "#ef4444" },
]

const topWebsites = [
  { name: "Main Website", uptime: 99.9, responseTime: 245, requests: 45200 },
  { name: "API Server", uptime: 99.8, responseTime: 156, requests: 38900 },
  { name: "E-commerce", uptime: 95.2, responseTime: 890, requests: 28400 },
  { name: "Blog", uptime: 98.5, responseTime: 312, requests: 15600 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  const handleExport = () => {
    console.log("Export analytics data")
  }

  return (
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <PageHeader title="Analytics"  subtitle=" Detailed performance insights and monitoring analytics.">
           <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          </PageHeader>

        {/* Key Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.2%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">265ms</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+12ms</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.2K</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.1%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-2</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <UptimeChart/>

        {/* Incidents and Status Distribution */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Incident History</CardTitle>
              <CardDescription>Monthly incidents and total downtime</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  incidents: {
                    label: "Incidents",
                    color: "hsl(var(--chart-3))",
                  },
                  downtime: {
                    label: "Downtime (min)",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="incidents" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Current status across all websites</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  online: { label: "Online", color: "#10b981" },
                  degraded: { label: "Degraded", color: "#f59e0b" },
                  down: { label: "Down", color: "#ef4444" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                {statusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Websites */}
        <Card>
          <CardHeader>
            <CardTitle>Website Performance Summary</CardTitle>
            <CardDescription>Performance metrics for your top websites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topWebsites.map((website, index) => (
                <div
                  key={website.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-2 sm:space-y-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{website.name}</h3>
                      <p className="text-sm text-muted-foreground">{website.requests.toLocaleString()} requests</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-foreground">{website.uptime}%</div>
                      <div className="text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">{website.responseTime}ms</div>
                      <div className="text-muted-foreground">Response</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  
  )
}
