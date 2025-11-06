"use client"

import { ReactElement, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  History,
  Search,
  Filter,
  Download,
  Eye,
  CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react"

import { AlertTable } from "@/components/custom/AlertTable"
import { useAppSelector } from "@/lib/hooks"
import { useFetchEvents } from "@/hooks/fetchEvents"
import { Skeleton } from "@/components/custom/Skeleton"
import PageHeader from "@/components/custom/pageheader"


interface StatType {
 label:string,
 value:number,
 icon: React.ReactNode,
 bg:string,
}

export default function AlertPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "resolved" | "unresolved">("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const {data,success,error,loading}=useFetchEvents();
   const total = data.length;
  const resolved = data.filter((a) => a.resolved).length
  const critical = data.filter((a) => a.level === "threat").length
  const stats = [
    {
      label: "Total Alerts",
      value: total,
      icon: <History className="h-6 w-6 text-primary" />,
      bg: "bg-primary/10",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      bg: "bg-green-500/10",
    },
    {
      label: "Critical",
      value: critical,
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      bg: "bg-red-500/10",
    },
  ]


  const filteredHistory = data.filter((alert) => {
    const matchesSearch =
      alert.websitename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity =
      severityFilter === "all" || alert.level === severityFilter
   const matchesStatus =
  statusFilter === "all"
    ? true
    : statusFilter === "resolved"
    ? alert.resolved === true
    : alert.resolved === false

    const matchesDateRange =
      !dateRange.from ||
      !dateRange.to ||
      (new Date(alert.timeAdded) >= dateRange.from &&
        new Date(alert.resolvedTime) <= dateRange.to)

    return matchesSearch && matchesSeverity && matchesStatus && matchesDateRange
  });


  const exportHistory = () => {
    const csvContent = [
      ["Timestamp", "Website", "Alert Name", "Severity", "Status", "Duration", "Message"],
      ...filteredHistory.map((alert) => [
        alert.timeAdded,
        alert.websitename,
        alert.name,
        alert.level,
        alert.resolved,
        alert.resolvedTime,
        alert.name,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `alert-history-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if(loading){
   return (
    <Skeleton />
   )
  }
  if(error){
    return(
      <div className="flex  justify-center items-center">Please Try Again Error Occured: {error}</div>
    )
  }
  if(data.length==0){
    return (
      <div className="flex space-y-8  justify-center items-center">No Events Found</div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader title="Alert History" subtitle="
            View and analyze past alerts and incidents across all your monitored services." >
         <Button onClick={exportHistory} variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
       <StatusCard stats={stats}  />
     
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </CardTitle>
          <CardDescription>Filter and search through your alert history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="mid">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="threat">threat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={String(statusFilter)}
                onValueChange={(val) => {
                  if (val === "all") setStatusFilter("all")
                  else if (val === "resolved") setStatusFilter("resolved")
                  else setStatusFilter("unresolved")
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {(searchTerm || severityFilter !== "all" || statusFilter || dateRange.from || dateRange.to) && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">
                Showing {filteredHistory.length} of {data.length} alerts
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSeverityFilter("all")
                  setStatusFilter("all")
                  setDateRange({})
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertTable filteredHistory={filteredHistory} />
    </div>
  )
}


const StatusCard = ({stats}:{
  stats:StatType[]
})=>{


  return(
    <>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}