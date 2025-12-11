"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import PageHeader from "@/components/custom/pageheader"

export type RuleType = "email" | "telegram"
export type level = "low" | "mid" | "high"| "threat"

interface Rule {
  id: string
  level: level
  website: { name: string; url: string }
  channel: { channelName: RuleType; channelDetails: string }
}

interface Website {
  id: string
  name: string
  url: string
}

interface Channel {
  id: string
  channelName: RuleType
  channelDetails: string
}

export default function RuleMonitorPage() {
  const { toast } = useToast()

  const [rules, setRules] = useState<Rule[]>([])
  const [websites, setWebsites] = useState<Website[]>([])
  const [channels, setChannels] = useState<Channel[]>([])

  const [isCreateDialog, setIsCreateDialog] = useState(false)

  const [newRule, setNewRule] = useState<{
    level: level
    websiteId: string
    channelId: string
  }>({
    level: "low",
    websiteId: "",
    channelId: "",
  })

  /* ──────────────────────────────
      FETCH RULES + CHANNELS + WEBSITES
  ───────────────────────────────*/
  useEffect(() => {
    async function loadData() {
      try {
        const [ruleRes, webRes, channelRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/rules/getrules`, {
            withCredentials: true
          }),
          axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/website/getwebsites`, {
            withCredentials: true
          }),
          axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/channel/getchannels`, {
            withCredentials: true
          }),
        ])

        setRules(ruleRes.data)
        setWebsites(webRes.data)
        setChannels(channelRes.data)

      } catch (err) {
        console.error(err)
      }
    }

    loadData()
  }, [])

  /* ──────────────────────────────
        CREATE RULE
  ───────────────────────────────*/
  const createRule = async () => {
    try {
      const selectedWebsite = websites.find((w) => w.id === newRule.websiteId)
      const selectedChannel = channels.find((c) => c.id === newRule.channelId)

      if (!selectedWebsite || !selectedChannel) return

      const payload = {
        website_id: selectedWebsite.id,
        channel_id: selectedChannel.id,
        level: newRule.level,
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/rules/create`,
        payload,
        { withCredentials: true }
      )

      const createdRule: Rule = {
        id: res.data.id, // backend returned id
        level: newRule.level,
        website: selectedWebsite,
        channel: selectedChannel,
      }

      setRules((prev) => [...prev, createdRule])

      setNewRule({ level: "low", websiteId: "", channelId: "" })
      setIsCreateDialog(false)

      toast({
        title: "Rule Created",
        description: "New alert rule added.",
      })
    } catch (error) {
      console.error(error)
    }
  }

  /* ──────────────────────────────
          DELETE RULE
  ───────────────────────────────*/
  const deleteRule = async (id: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/rules/delete`,
        { ruleId: id },
        { withCredentials: true }
      )

      setRules((prev) => prev.filter((r) => r.id !== id))

      toast({
        title: "Rule Deleted",
        description: "Rule removed successfully.",
      })
    } catch (error) {
      console.error(error)
    }
  }

  /* ──────────────────────────────
                 UI
  ───────────────────────────────*/
  return (
    <div className="space-y-6">


       <PageHeader title="Alert Rules">
        <Dialog open={isCreateDialog} onOpenChange={setIsCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <Plus className="h-4 w-4" /> Add Rule
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Rule</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">

              {/* LEVEL SELECT */}
              <div>
                <Label>Level</Label>
                <Select
                  value={newRule.level}
                  onValueChange={(v: level) => setNewRule((p) => ({ ...p, level: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="threat">Threat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* WEBSITE SELECT */}
              <div>
                <Label>Website</Label>
                <Select
                  value={newRule.websiteId}
                  onValueChange={(v) => setNewRule((p) => ({ ...p, websiteId: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select Website" /></SelectTrigger>
                  <SelectContent>
                    {websites.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name} — {w.url}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* CHANNEL SELECT */}
              <div>
                <Label>Channel (Email / Telegram)</Label>
                <Select
                  value={newRule.channelId}
                  onValueChange={(v) => setNewRule((p) => ({ ...p, channelId: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select Channel" /></SelectTrigger>
                  <SelectContent>
                    {channels.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.channelName} — {c.channelDetails}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={createRule}
                disabled={!newRule.websiteId || !newRule.channelId}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* RULE LIST */}
     <Card className="bg-background">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-foreground">
      Alert Rules
    </CardTitle>
    <CardDescription className="text-muted-foreground">
      Your configured alert rules.
    </CardDescription>
  </CardHeader>

  <CardContent>
    <div className="space-y-4 max-h-[400px] overflow-y-auto p-3">

      {rules.map((rule) => (
        <div key={rule.id}>
          <div className="flex items-start justify-between p-4 border rounded-lg bg-background shadow-sm">

            {/* LEFT SIDE */}
            <div className="flex items-start gap-4">

              {/* LEVEL BADGE */}
              <span
                className={`
                  px-2 py-1 text-xs font-semibold rounded-md
                  ${rule.level === "low" ? "bg-green-200 text-green-800" : ""}
                  ${rule.level === "mid" ? "bg-yellow-200 text-yellow-800" : ""}
                  ${rule.level === "threat" ? "bg-red-200 text-red-800" : ""}
                  ${rule.level === "high" ? "bg-orange-200 text-orange-800":""}
                `}
              >
                {rule.level.toUpperCase()}
              </span>

              {/* RULE DETAILS */}
              <div className="space-y-1">

                {/* WEBSITE */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {rule.website.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {rule.website.url}
                  </span>
                </div>

                {/* CHANNEL */}
                <div className="text-sm capitalize text-foreground mt-1">
                  {rule.channel.channelName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {rule.channel.channelDetails}
                </div>

              </div>
            </div>

            {/* DELETE BUTTON */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteRule(rule.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
