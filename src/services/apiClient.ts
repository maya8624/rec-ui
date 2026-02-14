import axios from "axios";
import { config } from "../config/config";

// TODO: Implement API client with interceptors for authentication, token refresh, logging, and error handling

export const api = axios.create({
    baseURL: config.apiBaseUrl || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});