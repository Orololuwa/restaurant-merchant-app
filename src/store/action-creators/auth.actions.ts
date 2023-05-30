import { Dispatch } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { appRoutes } from "core/routes/routes";
import { ExpirySession, tokenKey } from "lib/utils";
import { NavigateFunction } from "react-router-dom";
import authService from "services/auth.service";
import { actions } from "store/reducers/auth.reducers";

export const loginJWT = (
  navigate: NavigateFunction,
  from: string,
  data: {
    email: string;
    password: string;
  }
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.loginBegin());

      const res = await authService.login(data);

      ExpirySession.set(tokenKey, res.data.data.access_token);

      dispatch(actions.loginSuccess(true));
      navigate(from, { replace: true });
    } catch (err: any) {
      const axiosError = err as AxiosError<{ message: string }>;
      const msg = axiosError.response?.data?.message;
      dispatch(actions.loginError(msg || "Error"));
    }
  };
};

export const signUpJWT = (
  navigate: NavigateFunction,
  from: string,
  data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone: string;
    password: string;
  }
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.loginBegin());

      const res = await authService.signUp(data);

      ExpirySession.set(tokenKey, res.data.data.access_token);

      dispatch(actions.loginSuccess(true));
      navigate(from, { replace: true });
    } catch (err: any) {
      const axiosError = err as AxiosError<{ message: string }>;
      const msg = axiosError.response?.data?.message;
      dispatch(actions.loginError(msg || "Error"));
    }
  };
};

export const logOut = (navigate: NavigateFunction) => {
  return async (dispatch: Dispatch) => {
    try {
      ExpirySession.clear();
      dispatch(actions.logOut());
      navigate(appRoutes.SIGN_IN, { replace: true });
    } catch (err) {
      throw err;
    }
  };
};

export const getProfile = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.getProfileBegin());

      const res = await authService.getProfile();
      dispatch(actions.getProfileSuccess(res.data.data));
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const msg = axiosError.response?.data?.message;
      dispatch(actions.getProfileError(msg || "Error"));
    }
  };
};
