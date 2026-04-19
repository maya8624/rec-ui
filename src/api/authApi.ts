import { api } from "../services/apiClient";
import type { AuthResponse } from "../types/auth";

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    return data;
}

export async function registerApi(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", { email, password });
    return data;
}

export async function logoutApi(): Promise<void> {
    await api.post("/auth/logout");
}

export async function getMeApi(): Promise<AuthResponse> {
    const { data } = await api.get<AuthResponse>("/auth/me");
    return data;
}

export async function externalLoginApi(provider: string, idToken: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/external-login", { provider, idToken });
    return data;
}
