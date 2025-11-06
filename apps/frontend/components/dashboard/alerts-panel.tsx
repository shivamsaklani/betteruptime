"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { useFetchEvents } from "@/hooks/fetchEvents"
export function AlertsPanel() {
   const {data,loading,success}= useFetchEvents();
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
        case "threat":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Threat
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            High
          </Badge>
        )
      case "mid":
        return (
          <Badge variant="outline" className="text-orange-300 border-orange-300">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="h-fit">
  <CardHeader>
    <CardTitle>Recent Alerts</CardTitle>
    <CardDescription>Latest monitoring alerts and notifications</CardDescription>
  </CardHeader>
  <CardContent className="max-h-100 overflow-y-auto"> {/* Set max height and enable vertical scroll */}
    <div className="space-y-4">
      {data?.map((alert, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-sm truncate">{alert.name}</p>
              {getSeverityBadge(alert.level)}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {alert.resolved ? "Resolved" : "Unresolved"}
            </p>
            <p className="text-xs text-muted-foreground">
              {alert.resolvedTime ? new Date(alert.resolvedTime).toLocaleString() : "Unresolved"}
            </p>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

  )
}
