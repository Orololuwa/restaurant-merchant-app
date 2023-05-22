import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "models/auth";
import { tokenKey, ExpirySession } from "lib/utils";

const initialState: AuthState = {
  isLoggedIn: !!ExpirySession.get(tokenKey),
  loading: false,
  error: ""
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginBegin: (state: AuthState) => {
      state.loading = true;
      state.error = "";
    },
    loginSuccess: (state: AuthState, action: PayloadAction<boolean>) => {
      state.loading = false;
      state.isLoggedIn = action.payload;
      state.error = "";
    },
    loginError: (state: AuthState, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logOut: (state: AuthState) => {
      state.isLoggedIn = false;
    }
  }
});

export const actions = AuthSlice.actions;

export default AuthSlice.reducer;
