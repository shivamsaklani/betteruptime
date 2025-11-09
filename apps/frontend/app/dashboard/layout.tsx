"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logout, updateuser } from "@/lib/features/auth/authSlice"

import { LogOut, Menu } from "lucide-react"
import { Sidebar } from "@/components/custom/sidebar"
import axios from "axios"
import { NoticeButton } from "@/components/custom/NotificeBox"
import { useEffect} from "react"
import UserImage from "@/components/custom/UserImage"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  useEffect(()=>{
    getdetails();
  },[dispatch]);
  const getdetails = async ()=>{
    try {
     const detail = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/profile/getdetails`,{
      withCredentials:true
     });
    if(detail.status == 200){
       dispatch(updateuser({
      name:detail.data.name,
      profile:detail.data.profileImage,
      email:detail.data.email,
     }));
    }
    } catch (error) {
      
    }
  }
  const handleLogout = async() => {
    dispatch(logout())
    router.push("/");
    try {
       await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/user/logout`,{
        withCredentials:true
       }) // connect to this end point and destroy session data 
      dispatch({ type: "RESET_STORE" });
    } catch (error) {
      console.log("Logout Error"+error);
    }
  }

  return (
   <>
   <div className="min-h-screen bg-background">
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}  />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-accent"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-3 lg:gap-x-4">
              <ThemeToggle />
              <NoticeButton />
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />
              <div className="flex items-center gap-x-2">
                <UserImage image={user?.profile} email={user?.email}/>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-accent">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

    

        {/* Page content */}
        <main className="py-6 sm:py-8 lg:py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
   </> 
  )
}
