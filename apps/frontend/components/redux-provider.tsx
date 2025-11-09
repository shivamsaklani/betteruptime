"use client";

import type React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "@/lib/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
  <PersistGate
  loading={<div className="flex justify-center items-center h-screen">Loading...</div>}
  persistor={persistor}
>
  {children}
</PersistGate>


    </Provider>
  );
}
