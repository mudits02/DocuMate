/* eslint-disable no-unused-vars */
import { clearAccessToken } from "../../auth/tokenManager";
import {
  registerUnauthorizedHandler,
  requestNewAccessToken,
} from "../../api/api";
import {
  getCurrentUser,
  logoutRequest,
  startGithubLogin,
  startGoogleLogin,
} from "../../api/authApi";
import {
  authStart,
  setSession,
  clearSession,
  setAuthError,
  fetchReposStart,
  setRepos,
  setReposError
} from "./authSlice";
import { getGitHubRepos } from "../../api/githubApi";

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

export const fetchReposForGithubUser = () => async (dispatch, getState) => {
  const {auth} = getState();

  if(!auth.user?.github_user && auth.user?.provider !== 'github')
  {
    return;
  }

  dispatch(fetchReposStart());

  try{
    const repos = await getGitHubRepos();
    dispatch(setRepos(repos));
  }
  catch(error)
  {
    dispatch(
      setReposError(error?.response?.data?.error ?? "Failed to fetch repositories")
    );
  }
}

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

export const loginWithGithub = () => {
    startGithubLogin();
}
