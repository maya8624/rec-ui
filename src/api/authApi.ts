import { api } from "../services/apiClient";
import type { AuthResponse, AuthUser } from "../types/auth";

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    return data;
}

export async function registerApi(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", { email, password, firstName, lastName });
    return data;
}

export async function getMeApi(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
}

export async function externalLoginApi(provider: string, idToken: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/external-login", { provider, idToken });
    return data;
}

export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
    return data;
}
