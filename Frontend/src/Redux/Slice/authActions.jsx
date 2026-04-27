/* eslint-disable no-unused-vars */
import { clearAccessToken } from "../../auth/tokenManager";
import {
  registerUnauthorizedHandler,
  requestNewAccessToken,
} from "../../api/api";
import {
  getCurrentUser,
  logoutRequest,
  startGoogleLogin,
} from "../../api/authApi";
import {
  authStart,
  setSession,
  clearSession,
  setAuthError,
} from "./authSlice";

let bootstrapPromise = null;

export const bootstrapAuth = () => async (dispatch) => {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  dispatch(authStart());

  bootstrapPromise = (async () => {
    try {
      await requestNewAccessToken();
      const user = await getCurrentUser();

      dispatch(setSession(user));
      return true;
    } catch (error) {
      clearAccessToken();
      dispatch(clearSession());
      return false;
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
};

export const logoutUser = () => async (dispatch) => {
  try {
    await logoutRequest();
  } catch (error) {
    dispatch(setAuthError(error?.response?.data?.error ?? "Logout failed"));
  } finally {
    clearAccessToken();
    dispatch(clearSession());
  }
};

export const setupUnauthorizedHandling = (dispatch) => {
  registerUnauthorizedHandler(() => {
    clearAccessToken();
    dispatch(clearSession());
  });
};

export const loginWithGoogle = () => {
  startGoogleLogin();
};
