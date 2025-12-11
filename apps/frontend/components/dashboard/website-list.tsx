"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, CheckCircle, ExternalLink, Loader2, Trash2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Website } from "@/redux"
import { useAppDispatch } from "@/lib/hooks"
import { useEffect } from "react"

interface WebsiteListProps {
  websites: Website[]
  isLoading: boolean
}

export function WebsiteList({ websites, isLoading }: WebsiteListProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(()=>{

  },[dispatch]);

  const getStatusIcon = (status: Website["status"]) => {
    switch (status) {
      case "up": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "down": return <XCircle className="h-4 w-4 text-red-600" />
      case "degraded": return <AlertTriangle className="h-4 w-4 text-orange-600" />
    }
  }

  const getStatusBadge = (status: Website["status"]) => {
    switch (status) {
      case "up":
        return <Badge variant="outline" className="text-green-600 border-green-600">Online</Badge>
      case "down":
        return <Badge variant="outline" className="text-red-600 border-red-600">Down</Badge>
      case "degraded":
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Degraded</Badge>
    }
  }

  const handleWebsiteClick = (websiteId: string) => {
    router.push(`/dashboard/website/${websiteId}`)
  }

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Monitored Websites</CardTitle>
          <CardDescription>Status and performance of your monitored websites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0"
              >
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 self-start sm:self-center" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Monitored Websites</CardTitle>
        <CardDescription>Status and performance of your monitored websites</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {websites.map((website) => (
            <div
              key={website.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0"
            >
              {/* LEFT CLICKABLE SECTION */}
              <div
                className="group flex flex-1 flex-col sm:flex-row sm:items-center p-4 border rounded-lg hover:bg-accent/50 hover:border-accent-foreground/20 cursor-pointer transition-all duration-200 hover:shadow-sm space-y-3 sm:space-y-0"
                onClick={() => {
                  website.lastChecked == "0" ? null : handleWebsiteClick(website.id)
                }}
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {/* Replace Skeleton with Spinner */}
                  {website.lastChecked == "0" ? (
                    <Loader2 className="h-4 w-4 text-muted-foreground animate-spin mt-0.5" />
                  ) : (
                    <div className="flex-shrink-0 mt-0.5">{getStatusIcon(website.status)}</div>
                  )}

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {website.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a href={website.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                      <div className="flex-shrink-0 ml-4 sm:hidden">{getStatusBadge(website.status)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{website.url}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">Response:</span>
                        <span className="font-mono">{website.responseTime}ms</span>
                      </span>
                      <span className="hidden lg:flex items-center gap-1.5">
                        <span className="font-medium text-foreground">Last checked:</span>
                        <span className="font-mono">
                          {website.lastChecked}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right-side spinner or badge */}
                {website.lastChecked == "0" ? (
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                ) : (
                  <div className="hidden sm:flex flex-shrink-0 ml-4">{getStatusBadge(website.status)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}



