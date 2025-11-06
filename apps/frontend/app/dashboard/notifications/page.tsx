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
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Webhook,
  Plus,
  Edit,
  Trash2,
  TestTube,
  Volume2,
  Clock,
} from "lucide-react"
import PageHeader from "@/components/custom/pageheader"

interface NotificationChannel {
  id: string
  name: string
  type: "email" | "slack" | "sms" | "webhook" | "discord"
  config: Record<string, any>
  enabled: boolean
  testStatus?: "success" | "failed" | "pending"
}

export default function NotificationSettingsPage() {
  const { toast } = useToast()
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: "1",
      name: "Primary Email",
      type: "email",
      config: { email: "john.doe@example.com" },
      enabled: true,
      testStatus: "success",
    },
    {
      id: "2",
      name: "DevOps Slack",
      type: "slack",
      config: { webhook: "https://hooks.slack.com/services/...", channel: "#alerts" },
      enabled: true,
      testStatus: "success",
    },
    {
      id: "3",
      name: "Emergency SMS",
      type: "sms",
      config: { phone: "+1 (555) 123-4567" },
      enabled: false,
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newChannel, setNewChannel] = useState({
    name: "",
    type: "email" as const,
    config: {} as Record<string, any>,
  })

  const [notificationPreferences, setNotificationPreferences] = useState({
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
    frequency: {
      immediate: true,
      digest: false,
      digestTime: "09:00",
    },
    severity: {
      low: false,
      medium: true,
      high: true,
      critical: true,
    },
  })

  const handleToggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((channel) => (channel.id === id ? { ...channel, enabled: !channel.enabled } : channel)),
    )
    toast({
      title: "Notification channel updated",
      description: "The notification channel has been successfully updated.",
    })
  }

  const handleTestChannel = async (id: string) => {
    setChannels((prev) => prev.map((channel) => (channel.id === id ? { ...channel, testStatus: "pending" } : channel)))

    // Simulate test
    setTimeout(() => {
      setChannels((prev) =>
        prev.map((channel) => (channel.id === id ? { ...channel, testStatus: "success" } : channel)),
      )
      toast({
        title: "Test notification sent",
        description: "Check your notification channel for the test message.",
      })
    }, 2000)
  }

  const handleDeleteChannel = (id: string) => {
    setChannels((prev) => prev.filter((channel) => channel.id !== id))
    toast({
      title: "Notification channel deleted",
      description: "The notification channel has been successfully deleted.",
    })
  }

  const handleCreateChannel = () => {
    const channel: NotificationChannel = {
      id: Date.now().toString(),
      ...newChannel,
      enabled: true,
    }
    setChannels((prev) => [...prev, channel])
    setNewChannel({ name: "", type: "email", config: {} })
    setIsCreateDialogOpen(false)
    toast({
      title: "Notification channel created",
      description: "New notification channel has been successfully created.",
    })
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "slack":
        return <MessageSquare className="h-4 w-4" />
      case "sms":
        return <Smartphone className="h-4 w-4" />
      case "webhook":
        return <Webhook className="h-4 w-4" />
      case "discord":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTestStatusBadge = (status?: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Tested</Badge>
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Failed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Testing...</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader title="Notification Settings" subtitle="">
       <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Notification Channel</DialogTitle>
              <DialogDescription>
                Configure a new way to receive notifications about your monitored services.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="channelName">Channel Name</Label>
                <Input
                  id="channelName"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Primary Email, DevOps Slack"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channelType">Channel Type</Label>
                <Select
                  value={newChannel.type}
                  onValueChange={(value: any) => setNewChannel((prev) => ({ ...prev, type: value, config: {} }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newChannel.type === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newChannel.config.email || ""}
                    onChange={(e) =>
                      setNewChannel((prev) => ({ ...prev, config: { ...prev.config, email: e.target.value } }))
                    }
                    placeholder="notifications@example.com"
                  />
                </div>
              )}
              {newChannel.type === "slack" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="webhook">Webhook URL</Label>
                    <Input
                      id="webhook"
                      value={newChannel.config.webhook || ""}
                      onChange={(e) =>
                        setNewChannel((prev) => ({ ...prev, config: { ...prev.config, webhook: e.target.value } }))
                      }
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="channel">Channel</Label>
                    <Input
                      id="channel"
                      value={newChannel.config.channel || ""}
                      onChange={(e) =>
                        setNewChannel((prev) => ({ ...prev, config: { ...prev.config, channel: e.target.value } }))
                      }
                      placeholder="#alerts"
                    />
                  </div>
                </>
              )}
              {newChannel.type === "sms" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newChannel.config.phone || ""}
                    onChange={(e) =>
                      setNewChannel((prev) => ({ ...prev, config: { ...prev.config, phone: e.target.value } }))
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              )}
              {newChannel.type === "webhook" && (
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={newChannel.config.url || ""}
                    onChange={(e) =>
                      setNewChannel((prev) => ({ ...prev, config: { ...prev.config, url: e.target.value } }))
                    }
                    placeholder="https://api.example.com/webhooks/alerts"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateChannel} disabled={!newChannel.name}>
                Add Channel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Channels
          </CardTitle>
          <CardDescription>Manage where you receive alerts and notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map((channel, index) => (
              <div key={channel.id}>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(channel.type)}
                      <Switch
                        checked={channel.enabled}
                        onCheckedChange={() => handleToggleChannel(channel.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{channel.name}</h3>
                        <Badge variant="secondary" className="capitalize">
                          {channel.type}
                        </Badge>
                        {getTestStatusBadge(channel.testStatus)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {channel.type === "email" && channel.config.email}
                        {channel.type === "slack" && `${channel.config.channel} via Slack`}
                        {channel.type === "sms" && channel.config.phone}
                        {channel.type === "webhook" && "Custom webhook endpoint"}
                        {channel.type === "discord" && "Discord channel"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestChannel(channel.id)}
                      disabled={channel.testStatus === "pending"}
                      className="flex items-center gap-1"
                    >
                      <TestTube className="h-4 w-4" />
                      Test
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteChannel(channel.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index < channels.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Control when and how often you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quiet Hours */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Quiet Hours</Label>
                  <p className="text-sm text-muted-foreground">
                    Suppress non-critical notifications during these hours.
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.quietHours.enabled}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences((prev) => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, enabled: checked },
                    }))
                  }
                />
              </div>
              {notificationPreferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="quietStart">Start Time</Label>
                    <Input
                      id="quietStart"
                      type="time"
                      value={notificationPreferences.quietHours.start}
                      onChange={(e) =>
                        setNotificationPreferences((prev) => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, start: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quietEnd">End Time</Label>
                    <Input
                      id="quietEnd"
                      type="time"
                      value={notificationPreferences.quietHours.end}
                      onChange={(e) =>
                        setNotificationPreferences((prev) => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, end: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Notification Frequency */}
            <div className="space-y-4">
              <h4 className="font-medium">Notification Frequency</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">Immediate Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive alerts as soon as they occur.</p>
                  </div>
                  <Switch
                    checked={notificationPreferences.frequency.immediate}
                    onCheckedChange={(checked) =>
                      setNotificationPreferences((prev) => ({
                        ...prev,
                        frequency: { ...prev.frequency, immediate: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">Daily Digest</Label>
                    <p className="text-xs text-muted-foreground">Receive a summary of all alerts once per day.</p>
                  </div>
                  <Switch
                    checked={notificationPreferences.frequency.digest}
                    onCheckedChange={(checked) =>
                      setNotificationPreferences((prev) => ({
                        ...prev,
                        frequency: { ...prev.frequency, digest: checked },
                      }))
                    }
                  />
                </div>
                {notificationPreferences.frequency.digest && (
                  <div className="pl-4">
                    <div className="space-y-2">
                      <Label htmlFor="digestTime">Digest Time</Label>
                      <Input
                        id="digestTime"
                        type="time"
                        value={notificationPreferences.frequency.digestTime}
                        onChange={(e) =>
                          setNotificationPreferences((prev) => ({
                            ...prev,
                            frequency: { ...prev.frequency, digestTime: e.target.value },
                          }))
                        }
                        className="w-32"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Severity Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Alert Severity Filters
            </CardTitle>
            <CardDescription>Choose which severity levels trigger notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <div className="space-y-1">
                    <Label className="text-sm">Low Severity</Label>
                    <p className="text-xs text-muted-foreground">Minor issues that don't affect service.</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPreferences.severity.low}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences((prev) => ({
                      ...prev,
                      severity: { ...prev.severity, low: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="space-y-1">
                    <Label className="text-sm">Medium Severity</Label>
                    <p className="text-xs text-muted-foreground">Issues that may impact performance.</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPreferences.severity.medium}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences((prev) => ({
                      ...prev,
                      severity: { ...prev.severity, medium: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <div className="space-y-1">
                    <Label className="text-sm">High Severity</Label>
                    <p className="text-xs text-muted-foreground">Significant issues affecting service quality.</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPreferences.severity.high}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences((prev) => ({
                      ...prev,
                      severity: { ...prev.severity, high: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="space-y-1">
                    <Label className="text-sm">Critical Severity</Label>
                    <p className="text-xs text-muted-foreground">Service outages and critical failures.</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPreferences.severity.critical}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences((prev) => ({
                      ...prev,
                      severity: { ...prev.severity, critical: checked },
                    }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message Template</Label>
              <Textarea
                id="customMessage"
                placeholder="Customize your notification message template..."
                className="min-h-[80px] resize-none"
                defaultValue="🚨 Alert: {alert_name} - {website} is {status}. Response time: {response_time}ms"
              />
              <p className="text-xs text-muted-foreground">
                Use variables: {"{alert_name}"}, {"{website}"}, {"{status}"}, {"{response_time}"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-border">
        <Button className="min-w-[120px]">Save Preferences</Button>
      </div>
    </div>
  )
}
