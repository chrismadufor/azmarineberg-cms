"use client";

import { store } from "./store";
import { Provider } from "react-redux";

export function AppProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}