"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Plus, Edit, Trash2, Globe, Clock, Zap, Shield, TrendingUp } from "lucide-react"
import PageHeader from "@/components/custom/pageheader"

interface AlertRule {
  id: string
  name: string
  website: string
  type: "uptime" | "response_time" | "ssl" | "keyword"
  threshold: string
  enabled: boolean
  severity: "low" | "medium" | "high" | "critical"
  contacts: string[]
}

export default function AlertConfigurationPage() {
  const { toast } = useToast()
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "1",
      name: "Main Website Down",
      website: "https://example.com",
      type: "uptime",
      threshold: "1 minute",
      enabled: true,
      severity: "critical",
      contacts: ["email", "slack"],
    },
    {
      id: "2",
      name: "Slow Response Time",
      website: "https://api.example.com",
      type: "response_time",
      threshold: "> 2000ms",
      enabled: true,
      severity: "medium",
      contacts: ["email"],
    },
    {
      id: "3",
      name: "SSL Certificate Expiry",
      website: "https://example.com",
      type: "ssl",
      threshold: "30 days",
      enabled: false,
      severity: "high",
      contacts: ["email", "sms"],
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newRule, setNewRule] = useState({
    name: "",
    website: "",
    type: "uptime" as const,
    threshold: "",
    severity: "medium" as const,
    contacts: [] as string[],
  })

  const handleToggleRule = (id: string) => {
    setAlertRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
    toast({
      title: "Alert rule updated",
      description: "The alert rule has been successfully updated.",
    })
  }

  const handleDeleteRule = (id: string) => {
    setAlertRules((prev) => prev.filter((rule) => rule.id !== id))
    toast({
      title: "Alert rule deleted",
      description: "The alert rule has been successfully deleted.",
    })
  }

  const handleCreateRule = () => {
    const rule: AlertRule = {
      id: Date.now().toString(),
      ...newRule,
      enabled: true,
    }
    setAlertRules((prev) => [...prev, rule])
    setNewRule({
      name: "",
      website: "",
      type: "uptime",
      threshold: "",
      severity: "medium",
      contacts: [],
    })
    setIsCreateDialogOpen(false)
    toast({
      title: "Alert rule created",
      description: "New alert rule has been successfully created.",
    })
  }

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "uptime":
        return <Globe className="h-4 w-4" />
      case "response_time":
        return <Clock className="h-4 w-4" />
      case "ssl":
        return <Shield className="h-4 w-4" />
      case "keyword":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader title="Alert Configuration" subtitle="Set up monitoring alerts and define when you want to be notified about issues." >
           <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Alert Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Alert Rule</DialogTitle>
              <DialogDescription>Configure a new alert rule to monitor your websites and services.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  value={newRule.name}
                  onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Main Website Down"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website/Service</Label>
                <Input
                  id="website"
                  value={newRule.website}
                  onChange={(e) => setNewRule((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Alert Type</Label>
                  <Select
                    value={newRule.type}
                    onValueChange={(value: any) => setNewRule((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uptime">Uptime</SelectItem>
                      <SelectItem value="response_time">Response Time</SelectItem>
                      <SelectItem value="ssl">SSL Certificate</SelectItem>
                      <SelectItem value="keyword">Keyword</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    value={newRule.severity}
                    onValueChange={(value: any) => setNewRule((prev) => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Threshold</Label>
                <Input
                  id="threshold"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule((prev) => ({ ...prev, threshold: e.target.value }))}
                  placeholder="e.g., 1 minute, > 2000ms, 30 days"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRule} disabled={!newRule.name || !newRule.website}>
                Create Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Alert Rules Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alertRules.length}</p>
                <p className="text-sm text-muted-foreground">Total Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alertRules.filter((rule) => rule.enabled).length}</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alertRules.filter((rule) => rule.severity === "critical").length}</p>
                <p className="text-sm text-muted-foreground">Critical Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Rules List */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Rules</CardTitle>
          <CardDescription>Manage your monitoring alert rules and thresholds.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertRules.map((rule, index) => (
              <div key={rule.id}>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(rule.type)}
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">{rule.name}</h3>
                        <Badge variant="secondary" className={getSeverityColor(rule.severity)}>
                          {rule.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{rule.website}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Type: {rule.type.replace("_", " ")}</span>
                        <span>Threshold: {rule.threshold}</span>
                        <span>Contacts: {rule.contacts.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index < alertRules.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Global Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global Alert Settings</CardTitle>
          <CardDescription>Configure global settings that apply to all alert rules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cooldown">Alert Cooldown Period</Label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Minimum time between repeated alerts for the same issue.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="escalation">Escalation Delay</Label>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Time to wait before escalating unacknowledged alerts.</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable all alerts during maintenance windows.
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Smart Grouping</Label>
                <p className="text-sm text-muted-foreground">
                  Group related alerts together to reduce notification noise.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
