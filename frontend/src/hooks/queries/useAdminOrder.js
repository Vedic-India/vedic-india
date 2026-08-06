import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getOrderById } from "@/services/order.service";

/**
 * Fetch a single order for the admin details view.
 *
 * @param {string} orderId - MongoDB order ID.
 * @returns {import("@tanstack/react-query").UseQueryResult<any, Error>} React Query result for the order.
 */
export function useAdminOrder(orderId) {
  return useQuery({
    queryKey: queryKeys.adminOrder(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}