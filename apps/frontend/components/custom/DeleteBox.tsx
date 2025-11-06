"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Dialog, DialogClose, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { useAppDispatch } from "@/lib/hooks"
import { removeWebsite } from "@/lib/features/monitoring/monitoringSlice"

export default function DeleteBox({ websiteId , setNo }: { websiteId: string , setNo:()=>void }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false)

  async function handleDeleteWebsite(id: string) {
    try {
      setLoading(true)
      const res =await axios.delete(`${process.env.NEXT_PUBLIC_BACKENDURL}/website/deletewebsite/${id}`, {
        withCredentials: true,
      });
      if(res.status == 200) {
      dispatch(removeWebsite(id));
      }
      router.back();
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog> 
    <DialogDescription className="flex flex-col space-y-3">
      <p>Are you sure you want to delete this website?</p>
      <div className="flex gap-2">
        <Button onClick={() => handleDeleteWebsite(websiteId)} variant="default" disabled={loading}>
          {loading ? "Deleting..." : "Yes"}
        </Button>
         <DialogClose asChild>
          <Button onClick={setNo} variant="secondary">No</Button>
        </DialogClose>
      </div>
    </DialogDescription>
    </Dialog>
  )
}