"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Webhook,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import PageHeader from "@/components/custom/pageheader"
import axios from "axios"

interface ChannelType {
  id: string
  channelName: string
  channelDetails: string
  monitor: boolean
  user_id: string
}

interface NewChannelForm {
  channelName: string
  channelDetails: string
}

export default function NotificationSettingsPage() {
  const { toast } = useToast()
  const [channels, setChannels] = useState<ChannelType[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const [newChannel, setNewChannel] = useState<NewChannelForm>({
    channelName: "email",
    channelDetails: "",
  });

  // FETCH CHANNELS FROM BACKEND
  useEffect(() => {(async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDURL}/channel/getchannels`,
          { withCredentials: true }
        )
        setChannels(response.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [setChannels])

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "discord":
        return <MessageSquare className="h-4 w-4" />
      case "sms":
        return <Smartphone className="h-4 w-4" />
      case "webhook":
        return <Webhook className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const handleToggleChannel = async (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, monitor: !ch.monitor } : ch))
    );
    const updatedchannel =  channels.find((c)=>c.id===id)
   await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/channel/update`,{
       "isactive":!updatedchannel?.monitor,
      "channelId": id
    },{
      withCredentials:true
    });
    toast({
      title:"Channel Updated",
      description: `${updatedchannel?.monitor === true?"Channel InActive":"Channel Active"}`
    });

  }

  const handleDeleteChannel = async (id: string) => {
    setChannels((prev) => prev.filter((ch) => ch.id !== id))

    toast({
      title: "Channel deleted",
      description: "The channel has been removed.",
    })
      await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/channel/delete`,{
        channelId:id
      },{
      withCredentials:true
    });
    toast({
      title:"Channel Deleted",
    });
  }

  const handleCreateChannel = async () => {
    if (!newChannel.channelDetails.trim()) return

    const newObject = {
      channelName: newChannel.channelName,
      channelDetails: newChannel.channelDetails,
    }
    const create =  await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/channel/create`,newObject,{
      withCredentials:true
    });
    setChannels((prev) => [...prev,create.data])

    setNewChannel({
      channelName: "email",
      channelDetails: "",
    })

    setIsCreateDialogOpen(false)

    toast({
      title: "New channel created",
      description: "Your notification channel is now active.",
    })
  }

  return (
    <div className="space-y-8">
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
                Add a new endpoint for receiving alerts.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">

              {/* CHANNEL TYPE */}
              <div className="space-y-2">
                <Label>Channel Type</Label>
                <Select
                  value={newChannel.channelName}
                  onValueChange={(v) =>
                    setNewChannel((prev) => ({ ...prev, channelName: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CHANNEL DETAILS */}
              <div className="space-y-2">
                <Label>Details</Label>
                <Input
                  placeholder={
                    newChannel.channelName === "email"
                      ? "email@example.com"
                      : "Telegram link"
                  }
                  value={newChannel.channelDetails}
                  onChange={(e) =>
                    setNewChannel((prev) => ({
                      ...prev,
                      channelDetails: e.target.value,
                    }))
                  }
                />
              </div>

            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateChannel}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* CHANNEL LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Channels
          </CardTitle>
          <CardDescription>Your active alert channels.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 max-h-[400px] overflow-y-auto p-3">

            {channels.map((ch, idx) => (
              <div key={ch.id}>
                <div className="flex items-center  justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getChannelIcon(ch.channelName)}
                    <Switch
                      checked={ch.monitor}
                      onCheckedChange={() => handleToggleChannel(ch.id)}
                    />

                    <div>
                      <div className="font-medium capitalize">{ch.channelName}</div>
                      <div className="text-sm text-muted-foreground">
                        {ch.channelDetails}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm"
                      onClick={()=>{setIsCreateDialogOpen(true)}}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteChannel(ch.id)}
                      className="text-destructive"
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
