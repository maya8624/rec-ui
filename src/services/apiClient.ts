import axios from "axios";
import { config } from "../config/config";

export const api = axios.create({
    baseURL: config.apiBaseUrl || "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Avoid circular import — access store dynamically
            import("../store/authStore").then(({ useAuthStore }) => {
                useAuthStore.getState().logout();
            });
        }
        return Promise.reject(error);
    }
);
