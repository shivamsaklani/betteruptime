"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Activity, BarChart3, Bell, HistoryIcon, Home, Shield, UserCog, Users } from "lucide-react"
import LogoutButton from "./Logout"

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Websites", href: "/dashboard/website", icon: Activity },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Status", href: "/dashboard/status", icon: HistoryIcon },
  { name: "Notifications", href: "/dashboard/notifications", icon: Shield },
  { name: "Alert", href: "/dashboard/alertsconfig", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: UserCog },
]

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
       
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
       
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-xl">
          <div className="flex flex-col h-full justify-between">
          <div>
             <div className="flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">BetterUptime</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="hover:bg-accent">
              ✕
            </Button>
          </div>
          <nav className="mt-6 px-3">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-accent text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          </div>
          <div className="flex  justify-center  p-3">
               <LogoutButton/>
          </div>
         </div>
        
        </div>
        
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border px-6 pb-4 shadow-sm">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">BetterUptime</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex gap-x-3 rounded-lg p-2.5 text-sm font-semibold leading-6 transition-all duration-200 ${
                            isActive
                              ? "bg-accent text-white shadow-sm" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
         <LogoutButton/>
        </div>
      </div>
    </>
  )
}
