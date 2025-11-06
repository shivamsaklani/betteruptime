import { MonitoringState, Website } from "@/redux"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const initialState: MonitoringState = {
  websites: [],
  isLoading: false,
  error: null,
  selectedWebsite: null,
}

const monitoringSlice = createSlice({
  name: "monitoring",
  initialState,
  reducers: {
    fetchWebsitesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchWebsitesSuccess: (state, action: PayloadAction<Website[]>) => {
      state.isLoading = false
      state.websites = action.payload
      state.error = null
    },
    fetchWebsitesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    updateWebsiteStatus: (
      state,
      action: PayloadAction<{ id: string; status: Website["status"]; responseTime: number }>,
    ) => {
      const website = state.websites.find((w) => w.id === action.payload.id)
      if (website) {
        website.status = action.payload.status
        website.responseTime = action.payload.responseTime
        website.lastChecked = new Date().toISOString()
      }
    },
    selectWebsite: (state, action: PayloadAction<Website>) => {
      state.selectedWebsite = action.payload
    },
    addWebsite: (state, action: PayloadAction<Website>) => {
      state.websites.push(action.payload)
    },
    removeWebsite: (state, action: PayloadAction<string>) => {
      state.websites = state.websites.filter((w) => w.id !== action.payload)
    },
  },
})

export const {
  fetchWebsitesStart,
  fetchWebsitesSuccess,
  fetchWebsitesFailure,
  updateWebsiteStatus,
  selectWebsite,
  addWebsite,
  removeWebsite,
} = monitoringSlice.actions

export default monitoringSlice.reducer
