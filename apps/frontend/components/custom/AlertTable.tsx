import { AlertTriangle, BarChart3, CheckCircle, Clock, Eye, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { useAppSelector } from "@/lib/hooks"
import { recentIncidents } from "@/redux"
import { format } from "date-fns"
import { useState } from "react"

  const getSeverityColor = (severity: string) => {
        switch (severity) {
          case "low":
            return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
          case "medium":
            return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
          case "high":
            return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
          case "critical":
            return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
          default:
            return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
        }
      }
    
      const getStatusIcon = (status: boolean) => {
        switch (status) {
          case true:
            return <CheckCircle className="h-4 w-4 text-green-500" />
          case false:
            return <XCircle className="h-4 w-4 text-yellow-500" />
          default:
            return <AlertTriangle className="h-4 w-4" />
        }
      }

      const getStatusText = (status:boolean)=>{
        switch (status) {
          case true:
            return  <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                 Resolved
            </Badge>
        
          case false:
            return  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                  Unresolved
            </Badge>
          default :
           return <Badge variant="secondary" className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">
            </Badge>
            
        }
      }

export const AlertTable = ({filteredHistory}:{
  filteredHistory:recentIncidents[]
})=>{
    const [selectedAlert, setSelectedAlert] = useState<recentIncidents | null>(null)
    return(
        <>
          <Card>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
          <CardDescription>Detailed view of all alerts and incidents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border max-h-[600px] overflow-y-auto">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((alert:recentIncidents) => (
                  <TableRow key={alert.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {format(alert.timeAdded, "MMM dd, HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{alert.websitename}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{alert.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getSeverityColor(alert.level)}>
                        {alert.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(alert.resolved)}
                        
                          {getStatusText(alert.resolved)}
                        
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{getDurationms(alert.timeAdded,alert.resolvedTime)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAlert(alert)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                       <AlertBox selectedAlert={selectedAlert}/>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No alerts found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </CardContent>
      </Card>
        </>
    )
}

const getDurationms = (start: string, resolved: string): string => {
  const startTime = new Date(start).getTime()
  const resolvedTime = new Date(resolved).getTime()

  // Handle invalid or missing timestamps
  if (isNaN(startTime) || isNaN(resolvedTime) || resolvedTime < startTime) {
    return "N/A"
  }

  const diffMs = resolvedTime - startTime
  const seconds = Math.floor((diffMs / 1000) % 60)
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60)
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}


export const AlertBox = ({selectedAlert}:{
  selectedAlert:recentIncidents | null
}) =>{
   
   if(selectedAlert == null){
    return ;
   }


  return(
      <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {getStatusIcon(selectedAlert.resolved)}
                              {selectedAlert?.name}
                            </DialogTitle>
                            <DialogDescription>Alert details and timeline</DialogDescription>
                          </DialogHeader>
                          {selectedAlert && (
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Website</Label>
                                  <p className="text-sm text-muted-foreground">{selectedAlert.websitename}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Timestamp</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {format(selectedAlert.timeAdded, "PPP 'at' HH:mm:ss")}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Severity</Label>
                                  <Badge variant="secondary" className={getSeverityColor(selectedAlert.level)}>
                                    {selectedAlert.level}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Duration</Label>
                                  <p className="text-sm text-muted-foreground">{getDurationms(selectedAlert.timeAdded,selectedAlert.resolvedTime)}</p>
                                </div>
          
                                {selectedAlert.timeAdded && (
                                  <div>
                                    <Label className="text-sm font-medium">Resolved At</Label>
                                    <p className="text-sm text-muted-foreground">{format(selectedAlert.timeAdded,"PPP 'at' HH:mm:ss")}</p>
                                  </div>
                                )}
                              </div>
                              <Separator />
                              <div>
                                <Label className="text-sm font-medium">Message</Label>
                                <p className="text-sm text-muted-foreground mt-1">{selectedAlert.name}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
  )
}