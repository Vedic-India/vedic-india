import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth.service";
import { queryKeys } from "@/constants/queryKeys";

export function useCurrentUser() {
    return useQuery({
        queryKey: queryKeys.currentUser,
        queryFn: getCurrentUser,

        retry: false,

        staleTime: 5 * 60 * 1000,

        gcTime: 10 * 60 * 1000,
    });
}