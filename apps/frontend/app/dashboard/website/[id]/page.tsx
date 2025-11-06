"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useEffect, useState } from "react"
import { selectWebsite } from "@/lib/features/monitoring/monitoringSlice"
import axios from "axios"
import ResponseChart from "@/components/charts/ResponseChart"
import UptimeChart from "@/components/charts/UptimeChart"
import SelectRange from "@/components/custom/SelectRange"
import { WebsiteEdits } from "@/components/custom/WebsiteEdits"


interface websiteDataType {
  uptime: number[],
  label: string[],
  responsetime: number[]

};
export default function WebsiteDetailPage() {

  const params = useParams()
  const websiteId = params.id as string;
  const dispatch = useAppDispatch();
  const website = useAppSelector((state) => state.monitoring.selectedWebsite);
  const router = useRouter();
  const [websitedata, setWebsitedata] = useState<websiteDataType>({
    uptime: [],
    label: [],
    responsetime: [],
  });
  const [selectedRange, setSelectedRange] = useState<string>("1h"); // default 1 hour
 
  useEffect(() => {
    const response = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/website/selectwebsite/${websiteId}`, {
        withCredentials: true
      });
      dispatch(selectWebsite(res.data));
    }
    response();

  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uptimedata = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/charts/uptime/${websiteId}`, {
          withCredentials: true
        });
        const timedata = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/charts/responsetime/${websiteId}?timeframe=${selectedRange}`, {
          withCredentials: true
        });
        setWebsitedata({
          uptime: uptimedata.data.status,
          label: timedata.data.label,
          responsetime: timedata.data.responsetime,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [websiteId, selectedRange]);


  if (!website) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Website Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested website could not be found.</p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "down":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
    }
  }
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
  }// function for Level UI Box
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "up":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>
      case "down":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Down</Badge>
      case "degraded":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Degraded</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} size="icon" asChild>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(website.status)}
              <h1 className="text-2xl font-bold">{website.name}</h1>
              {getStatusBadge(website.status)}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-muted-foreground">{website.url}</p>
              <Button variant="ghost" size="icon" className="h-4 w-4" asChild>
                <a href={website.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(website.status)}
              <span className="text-2xl font-bold capitalize">{website.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(website.uptime).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{website.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Checked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {website.lastChecked
                ? new Date(website.lastChecked).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "N/A"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Uptime Trend</CardTitle>
            <CardDescription>Uptime percentage</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {websitedata.uptime.length > 0 && (
              <UptimeChart uptimedata={websitedata.uptime} />
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>Average response time</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full">
            <SelectRange value={selectedRange} onChange={setSelectedRange} />

            <div className="w-full flex-1 min-h-[250px]">
              <ResponseChart responsedata={websitedata.responsetime} labels={websitedata.label} />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Latest downtime and performance issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {website.recentIncidents.length>0 ? 
              (website.recentIncidents.map((incident, index) => {
              if (!incident.timeAdded || !incident.resolvedTime) return null; // handle missing data

              const timeAdded = new Date(incident.timeAdded).getTime();   // getTime() returns number
              const resolvedTime = new Date(incident.resolvedTime).getTime();

              const durationMinute = Math.round((resolvedTime - timeAdded) / (1000 * 60));

              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex  items-center space-x-4">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <div >
                      <p className="font-medium">{incident.name}</p>
                      {incident.resolved ? (
                        <p className="text-sm text-muted-foreground">
                          {new Date(incident.resolvedTime).toLocaleDateString()} • Duration: {durationMinute} minutes ago
                        </p>
                      ): (
                        <p>Unresolved</p>
                      )}
                     
                    </div>
                  </div>
                   <div className="flex">
                        {getSeverityBadge(incident.level)}
                        </div>
                </div>
              );
            })
            ):(<div className="justify-center flex">No Recent Icidents</div>)}


          </div>
        </CardContent>
      </Card>

      {/* Website Edits */}
      <WebsiteEdits websiteid={websiteId}/>
    </div>
  )
}
