import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  resetToken: "",
  userId: "",
  userProfile: {},
  fetchUserCall: true,
  logout: false,
  adminLoggedIn: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveEmail: (state, { payload }) => {
      state.email = payload;
    },
    saveResetToken: (state, { payload }) => {
      state.resetToken = payload;
    },
    setUserId: (state, { payload }) => {
      state.userId = payload;
    },
    setUserProfile: (state, { payload }) => {
      state.userProfile = payload;
    },
    changeFetchUserCall: (state, { payload }) => {
      state.fetchUserCall = payload;
    },
    setLogout: (state, { payload }) => {
      state.logout = payload;
    },
    setAdminLoggedIn: (state, { payload }) => {
      state.adminLoggedIn = payload;
    },
  },
});

export const {
  saveEmail,
  saveResetToken,
  setUserId,
  setUserProfile,
  setLogout,
  changeFetchUserCall,
  setAdminLoggedIn,
} = authSlice.actions;
export default authSlice.reducer;
