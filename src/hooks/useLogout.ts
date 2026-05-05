import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { currentUserQueryKey } from "./useCurrentUser";
import { tokenStorage } from "../utils/tokenStorage";

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return () => {
        tokenStorage.clear();
        queryClient.setQueryData(currentUserQueryKey, null);
        navigate("/login", { replace: true });
    };
}
