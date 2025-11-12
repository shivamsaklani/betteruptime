"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import type {notice, recentIncidents } from "@/redux";
import { Bell, X } from "lucide-react";
import axios from "axios";
import { clearnotification, setnotification } from "@/lib/features/notifications/notifySlice";

interface NoticeBoxProps {
  isNotice: boolean;
  onclose: () => void;
}

export const NoticeButton = ()=>{

  const [noticebox,setnoticebox]=useState(false);
  const notice = useAppSelector((state)=>state.Notification);
  const dispatch = useAppDispatch();
  const close = ()=>{
    setnoticebox(false);
    dispatch(clearnotification());
  }
    return(<>
    
    <Button onClick={()=>setnoticebox((prev)=>!prev)} variant="ghost" size="icon" className="hover:bg-primary p-5 relative flex items-center justify-center">
                <Bell className="h-6 w-6"/>
                <span className="absolute text-primary/80 flex -top-1 -right-1 items-center justify-center h-4 w-4">{notice.length>0?"+"+notice.length:""}</span>
    </Button>
    
    <NoticeBox isNotice={noticebox} onclose={close}/></>
         
    )
}

export const NoticeBox = ({ isNotice, onclose }: NoticeBoxProps) => {
  const dispatch = useAppDispatch();
  const notices = useAppSelector((state)=>state.Notification);

  useEffect(() => {
    (async()=>{
  try {
       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/website/getalerts`,{
          withCredentials:true
       });
       if(res.status === 200 ){
         const flatdata:notice[]= res.data.alerts.map((alert:recentIncidents)=>({
       website:alert.websitename,
       id:alert.websiteId,
       mesg:alert.name,
       ack:false
       }));
       dispatch(setnotification(flatdata));}
  } catch (error) {
    console.log(error);
  }
     
    })();
  }, [dispatch]);

  if (!isNotice) return null;
  console.log(notices);

  return (
    <div
      className="
        fixed right-6 top-20 z-50
        transition-all duration-300
        animate-in fade-in slide-in-from-top-5
      "
    >
      <Card className="w-96 border-border shadow-lg bg-background">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Recent notices and announcements
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={onclose}
          >
            <X/>
          </Button>
        </CardHeader>

        <CardContent className="max-h-64 overflow-y-auto">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <div
                key={notice.id}
                className="border-b hover:hover:bg-accent/50 hover:rounded-md cursor-pointer border-border p-2  last:border-none"
              >
                
                    <p className="font-xs text-foreground">{notice.mesg}</p>
                <p className="text-sm text-muted-foreground">
                  {notice.website}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No new notices yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
