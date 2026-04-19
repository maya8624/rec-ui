import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "../api/authApi";
import type { AuthUser } from "../types/auth";

export const currentUserQueryKey = ["auth", "me"] as const;

export function useCurrentUser() {
    return useQuery<AuthUser>({
        queryKey: currentUserQueryKey,
        queryFn: getMeApi,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}
