import { api } from "./api";

export const getCurrentUser = async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
};

export const logoutRequest = async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
}

export const startGoogleLogin = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL ?? "";
    window.location.href = `${BASE_URL}/api/auth/google`;
}
