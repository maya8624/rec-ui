import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../api/authApi";
import { currentUserQueryKey } from "./useCurrentUser";

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return async () => {
        await logoutApi();
        queryClient.setQueryData(currentUserQueryKey, null);
        navigate("/login", { replace: true });
    };
}
