import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [],
  users: [],
  requests: [],
  analytics: {},
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    saveServices: (state, { payload }) => {
      state.services = payload;
    },
    saveUsers: (state, { payload }) => {
      state.users = payload;
    },
    saveRequests: (state, { payload }) => {
      state.requests = payload;
    },
    saveAnalytics: (state, { payload }) => {
      state.analytics = payload;
    },
  },
});

export const { saveServices, saveUsers, saveRequests, saveAnalytics } = adminSlice.actions;
export default adminSlice.reducer;

