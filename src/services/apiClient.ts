import axios from "axios";
import { config } from "../config/config";
import { queryClient } from "../lib/queryClient";
import { tokenStorage } from "../utils/tokenStorage";

export const api = axios.create({
    baseURL: config.apiBaseUrl || "/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 90000,
});

api.interceptors.request.use((requestConfig) => {
    const token = tokenStorage.get();
    if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url: string = error.config?.url ?? "";
        const isAuthEndpoint = url.startsWith("/auth/");
        if (error.response?.status === 401 && !isAuthEndpoint) {
            tokenStorage.clear();
            queryClient.setQueryData(["auth", "me"], null);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
