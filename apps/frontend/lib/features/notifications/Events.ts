import { recentIncidents } from "@/redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EventsState {
  data: recentIncidents[];
  loading: boolean;
  error: string | null;
  success: boolean; 
}

const initialState: EventsState = {
  data: [],
  loading: false,
  error: null,
  success: false,
};

const Events = createSlice({
  name: "Incidents",
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<recentIncidents[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      state.success = true; // ✅ mark success on set
    },
    addAlert: (state, action: PayloadAction<recentIncidents>) => {
      state.data.push(action.payload);
      state.success = true;
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((n) => n.id !== action.payload);
      state.success = true;
    },
    resetAlert: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    websiteAlerts: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((n) => n.websiteId !== action.payload);
      state.success = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) state.success = false; 
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) state.success = false; 
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
  },
});

export const {setAlerts,setError,setLoading,setSuccess,websiteAlerts,resetAlert,removeAlert,addAlert}=Events.actions;
export default Events.reducer;
