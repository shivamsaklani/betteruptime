"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchWebsitesFailure, fetchWebsitesStart, fetchWebsitesSuccess } from "@/lib/features/monitoring/monitoringSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WebsiteList } from "@/components/dashboard/website-list"
import { Plus, Search, Filter } from "lucide-react"
import axios from "axios"
import { DialogBox } from "@/components/custom/DialogBox"
import PageHeader from "@/components/custom/pageheader"

export default function WebsitesPage() {
  const dispatch = useAppDispatch()
  const { websites, isLoading } = useAppSelector((state) => state.monitoring)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    const fetchWebsites = async () => {
      dispatch(fetchWebsitesStart());

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDURL}/website/getwebsites`,
          { withCredentials: true }
        );

        dispatch(fetchWebsitesSuccess(res.data));
      } catch (err) {
        dispatch(fetchWebsitesFailure(err as string));
      }
    };

    // Initial fetch on component mount
    fetchWebsites();
  }, [dispatch]);

  // Poll for websites with response time of 0
  useEffect(() => {
    const pollForResponseTimes = async () => {
      // Check if any website has responseTime of 0
      const hasZeroResponseTime = websites.some(
        (w) => !w.responseTime || w.responseTime === 0
      );
      console.log(hasZeroResponseTime);
      // If all websites have valid response times, stop polling
      if (!hasZeroResponseTime) {
        return;
      }

      // Fetch websites again
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDURL}/website/getwebsites`,
          { withCredentials: true }
        );
        console.log(res.data);

        dispatch(fetchWebsitesSuccess(res.data));
      } catch (err) {
        console.error("Error polling for response times:", err);
      }
    };

    // Set up interval to poll every 3 seconds
    const intervalId = setInterval(() => {
      const hasZeroResponseTime = websites.some(
        (w) => !w.responseTime || w.responseTime === 0
      );

      if (hasZeroResponseTime) {
        pollForResponseTimes();
      }
    }, 3000); // Poll every 3 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [websites, dispatch]);



  // Filter websites based on search term and status
  const filteredWebsites = websites.filter((website) => {
    const matchesSearch =
      website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      website.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || website.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddWebsite = () => {
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header Section */}
      <PageHeader title="Websites" subtitle="Manage and monitor all your websites in one place.">
        <Button onClick={handleAddWebsite} className="self-start sm:self-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Website
        </Button>
      </PageHeader>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search websites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="up">Online</SelectItem>
              <SelectItem value="down">Down</SelectItem>
              <SelectItem value="degraded">Degraded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredWebsites.length} of {websites.length} websites
        {searchTerm && ` matching "${searchTerm}"`}
        {statusFilter !== "all" && ` with status "${statusFilter}"`}
      </div>

      {/* Website List */}
      <div className="w-full">
        <WebsiteList websites={filteredWebsites} isLoading={isLoading} />
      </div>

      {/* Empty State */}
      {!isLoading && filteredWebsites.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No websites found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first website to monitor."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={handleAddWebsite} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Website
              </Button>
            )}
          </div>
        </div>
      )}
      <DialogBox isCreateDialogOpen={isCreateDialogOpen} setIsCreateDialogOpen={setIsCreateDialogOpen} />
    </div>
  )
}
