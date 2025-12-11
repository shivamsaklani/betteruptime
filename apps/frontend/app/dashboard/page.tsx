"use client"

import { useEffect} from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchWebsitesFailure, fetchWebsitesStart, fetchWebsitesSuccess } from "@/lib/features/monitoring/monitoringSlice"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { WebsiteList } from "@/components/dashboard/website-list"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import axios from "axios"
import PageHeader from "@/components/custom/pageheader"
export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { websites, isLoading } = useAppSelector((state) => state.monitoring)

useEffect(() => {
  const fetchWebsites = async () => {
    dispatch(fetchWebsitesStart());

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/website/getwebsites`, {
        withCredentials: true
      });

      // Merge and remove duplicates based on id
      const mergedWebsites = [...websites, ...res.data];
      const uniqueWebsitesMap = new Map();
      mergedWebsites.forEach(site => {
        uniqueWebsitesMap.set(site.id, site); // latest entry for same id will overwrite
      });

      const uniqueWebsites = Array.from(uniqueWebsitesMap.values());

      // Dispatch
      dispatch(fetchWebsitesSuccess(uniqueWebsites));
    } catch (err) {
       dispatch(fetchWebsitesFailure(err as string));
    }
  };

  fetchWebsites();
}, [dispatch]);


  return (
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <PageHeader title="Dashboard" subtitle="Monitor your websites and track performance metrics."/>

        <div className="w-full">
          <OverviewStats websites={websites} />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
          <div className="w-full">
            {/* <UptimeChart uptimedata={} /> */}
          </div>
          <div className="w-full">
            {/* <ResponseChart labels={} responsedata={websites} /> */}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-3">
          <div className="xl:col-span-2 w-full">
            <WebsiteList websites={websites} isLoading={isLoading} />
          </div>
          <div className="xl:col-span-1 w-full">
            <AlertsPanel />
          </div>
        </div>
      </div>
  )
}
