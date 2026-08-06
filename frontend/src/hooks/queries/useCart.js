import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getCart } from "@/services/cart.service";

export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}