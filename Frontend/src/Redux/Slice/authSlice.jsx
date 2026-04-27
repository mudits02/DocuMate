// src/Redux/Slice/authSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    setSession: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    clearSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { authStart, setSession, clearSession, setAuthError } =
  authSlice.actions;

export default authSlice.reducer;
