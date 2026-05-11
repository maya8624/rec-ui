import axios from "axios";
import { config } from "../config/config";
import { queryClient } from "../lib/queryClient";
import { tokenStorage } from "../utils/tokenStorage";
import type { AuthResponse } from "../types/auth";

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

type PendingRequest = {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
};

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

function redirectToLogin() {
    tokenStorage.clear();
    queryClient.setQueryData(["auth", "me"], null);
    window.location.href = '/login';
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const url: string = originalRequest?.url ?? "";
        const isAuthEndpoint = url.startsWith("/auth/");

        if (error.response?.status !== 401 || isAuthEndpoint) {
            return Promise.reject(error);
        }

        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
            redirectToLogin();
            return Promise.reject(error);
        }

        // Another refresh is already in flight — queue this request until it resolves
        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                pendingRequests.push({ resolve, reject });
            }).then((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            const { data } = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
            tokenStorage.setTokens(data.token, data.refreshToken);
            queryClient.setQueryData(["auth", "me"], data);

            pendingRequests.forEach(({ resolve }) => resolve(data.token));
            pendingRequests = [];

            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return api(originalRequest);
        } catch (refreshError) {
            pendingRequests.forEach(({ reject }) => reject(refreshError));
            pendingRequests = [];
            redirectToLogin();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
