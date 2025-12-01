import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [],
  requests: [],
  analytics: {},
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    saveServices: (state, { payload }) => {
      state.services = payload;
    },
    saveRequests: (state, { payload }) => {
      state.requests = payload;
    },
    saveAnalytics: (state, { payload }) => {
      state.analytics = payload;
    },
  },
});

export const { saveServices, saveRequests, saveAnalytics } = dashboardSlice.actions;
export default dashboardSlice.reducer;
