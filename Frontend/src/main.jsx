/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { routes } from "./Routes.jsx";
import store from "./Redux/store.jsx";
import {
  bootstrapAuth,
  setupUnauthorizedHandling,
} from "./Redux/Slice/authActions.jsx";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setupUnauthorizedHandling(dispatch);

    if (window.location.pathname !== "/auth/callback") {
      dispatch(bootstrapAuth());
    }
  }, [dispatch]);

  return children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthBootstrap>
        <RouterProvider router={routes} />
      </AuthBootstrap>
    </Provider>
  </StrictMode>
);
