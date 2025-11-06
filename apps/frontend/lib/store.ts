// lib/store.ts
"use client";  // ensures this file is only ever imported in client components

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./features/auth/authSlice"
import monitoringReducer from "./features/monitoring/monitoringSlice"
import reducer from "./features/notifications/notifySlice";
import Alerts from "./features/notifications/Events";

const rootReducer = combineReducers({
  auth: authReducer,
  monitoring: monitoringReducer,
  Notification: reducer,
  Alerts: Alerts,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const Reducer= (state: any, action: any) => {
  if (action.type === "RESET_STORE") {
    // Remove persisted storage
    storage.removeItem("persist:root");
    // Reset Redux state
    state = undefined;
  }
  return persistedReducer(state, action);
};

export const store = configureStore({
  reducer: Reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
