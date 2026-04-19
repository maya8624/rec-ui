import { create } from "zustand";
import { loginApi, registerApi, logoutApi, getMeApi, externalLoginApi } from "../api/authApi";
import type { AuthUser } from "../types/auth";

type AuthState = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
};

type AuthActions = {
    initialize: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: (idToken: string) => Promise<void>;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    user: null,
    isAuthenticated: false,
    isInitializing: true,

    initialize: async () => {
        try {
            const user = await getMeApi();
            set({ user, isAuthenticated: true });
        } catch {
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isInitializing: false });
        }
    },

    login: async (email, password) => {
        const user = await loginApi(email, password);
        set({ user, isAuthenticated: true });
    },

    register: async (email, password) => {
        const user = await registerApi(email, password);
        set({ user, isAuthenticated: true });
    },

    logout: async () => {
        try {
            await logoutApi();
        } finally {
            set({ user: null, isAuthenticated: false });
        }
    },

    loginWithGoogle: async (idToken) => {
        const user = await externalLoginApi("google", idToken);
        set({ user, isAuthenticated: true });
    },
}));
