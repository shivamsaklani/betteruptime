import { useRef, useState } from "react";
import { AlertDialogHeader } from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { addWebsite, fetchWebsitesStart } from "@/lib/features/monitoring/monitoringSlice";
import axios, { AxiosResponse } from "axios";
import { Website } from "@/redux";

export function DialogBox({ isCreateDialogOpen, setIsCreateDialogOpen }: {
  isCreateDialogOpen: boolean,
  setIsCreateDialogOpen: (Open: boolean) => void
}) {
  const [websiteName, setWebsiteName] = useState("")
  const dispatch = useAppDispatch();
  const [websiteUrl, setWebsiteUrl] = useState("")
  const setpolling= useRef(false);


   const pollingData = async (websiteId:string,interval=600):Promise<Website>=>{
    while (true) {
      
      if (setpolling.current) {
        throw new Error("Polling stopped");
      }

      try {

        const res: AxiosResponse<Website> = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDURL}/website/selectwebsite/${websiteId}`,
          { withCredentials: true }
        );

        if (res.status === 200 && res.data?.status) {
          return res.data;
        }
      } catch (err) {
         console.log("Please Try Again. Facing Some Issues");
      }
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
 
  }

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = websiteName.trim();
    const normalized = normalizeUrl(websiteUrl.trim());
    if (!name || !normalized) {
      return;
    }

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/website/createwebsite`, {
          url: normalized,
          name: name
        }, {
          withCredentials: true
        });
        setpolling.current=false;
        dispatch(fetchWebsitesStart);
        const checkrecenttick = await pollingData(response.data);
        if (checkrecenttick) {
        
          dispatch(
            addWebsite({
              id: response.data,
              name,
              url: normalized,
              status: checkrecenttick.status,
              responseTime:checkrecenttick.responseTime, // optional
              lastChecked: checkrecenttick.lastChecked,
              location:checkrecenttick.location,
              uptime:checkrecenttick.uptime,
              checkInterval:checkrecenttick.checkInterval,
              recentIncidents:checkrecenttick.recentIncidents
            })
          );
          setIsCreateDialogOpen(false);
          setWebsiteName("");
          setWebsiteUrl("");
        }
       
    } catch (err) {
      console.error(err);
      alert("Website is down or unreachable. Please check the URL.");
    }
  };

 

  const normalizeUrl = (input: string): string | null => {
    try {
      const u = input.includes("://") ? input : `https://${input}`
      const url = new URL(u)
      return url.href
    } catch {
      return null
    }
  }
  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <DialogTitle>Add Website</DialogTitle>
          <DialogDescription>
            Start monitoring a new website. We will begin checking uptime and performance.
          </DialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleCreateWebsite} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="website-name">Name</Label>
            <Input
              id="website-name"
              placeholder="e.g., Main Website"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website-url">URL</Label>
            <Input
              id="website-url"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              inputMode="url"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Website</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}