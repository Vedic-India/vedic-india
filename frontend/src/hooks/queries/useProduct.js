import { useQuery } from "@tanstack/react-query";

import { getProductByIdentifier } from "@/services/product.service";
import { queryKeys } from "@/constants/queryKeys";

export function useProduct(slug) {
  return useQuery({
    queryKey: queryKeys.product(slug),

    queryFn: () => getProductByIdentifier(slug),

    enabled: !!slug,

    staleTime: 5 * 60 * 1000,

    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,
  });
}