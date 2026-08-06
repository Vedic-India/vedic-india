import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getMyOrders } from "@/services/order.service";

/**
 * Fetch the authenticated customer's orders.
 *
 * @returns {import("@tanstack/react-query").UseQueryResult<any, Error>} React Query result for the current user's orders.
 */
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: getMyOrders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}