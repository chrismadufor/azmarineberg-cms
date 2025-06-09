import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  sales: [],
  customers: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    saveProducts: (state, { payload }) => {
      state.products = payload;
    },
    saveSales: (state, { payload }) => {
      state.sales = payload;
    },
    saveCustomers: (state, { payload }) => {
      state.customers = payload;
    },
  },
});

export const { saveProducts, saveSales, saveCustomers } = dashboardSlice.actions;
export default dashboardSlice.reducer;
