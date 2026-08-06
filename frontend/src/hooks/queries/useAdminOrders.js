import { useInfiniteQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getAllOrders } from "@/services/order.service";

function buildQueryParams(filters, pageParam) {
  const params = {
    ...filters,
    ...pageParam,
  };

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

/**
 * Fetch paginated admin orders with cursor-based infinite scrolling.
 *
 * @param {Object} filters - Active filters.
 * @param {string} filters.search - Search term.
 * @param {string} filters.orderStatus - Order status filter.
 * @param {string} filters.paymentStatus - Payment status filter.
 * @param {number} [filters.limit=10] - Page size.
 * @returns {import("@tanstack/react-query").UseInfiniteQueryResult<any, Error>} Infinite query result for admin orders.
 */
export function useAdminOrders(filters = {}) {
  const normalizedFilters = {
    limit: filters.limit ?? 10,
    search: filters.search || "",
    orderStatus: filters.orderStatus || "",
    paymentStatus: filters.paymentStatus || "",
  };

  return useInfiniteQuery({
    queryKey: [...queryKeys.adminOrders, normalizedFilters],
    queryFn: ({ pageParam = {} }) => getAllOrders(buildQueryParams(normalizedFilters, pageParam)),
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasMore || !lastPage?.nextCursor) {
        return undefined;
      }

      return {
        cursorCreatedAt: lastPage.nextCursor.createdAt,
        cursorId: lastPage.nextCursor.id,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}