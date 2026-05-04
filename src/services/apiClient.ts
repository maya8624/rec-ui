import axios from "axios";
import { config } from "../config/config";
import { queryClient } from "../lib/queryClient";
import { logoutApi } from "../api/authApi";

export const api = axios.create({
    baseURL: config.apiBaseUrl || "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 90000,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const url: string = error.config?.url ?? "";
        const isAuthEndpoint = url.startsWith("/auth/");
        if (error.response?.status === 401 && !isAuthEndpoint) {
            await logoutApi();
            queryClient.setQueryData(["auth", "me"], null);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
