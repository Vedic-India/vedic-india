import { useQuery } from "@tanstack/react-query";

import { getAllProducts, getAllProductsAdmin } from "@/services/product.service";
import { queryKeys } from "@/constants/queryKeys";
import { useAuth } from "@/context/AuthContext";

export function useProducts() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: [...queryKeys.products, isAdmin ? "admin" : "public"],

    queryFn: () =>
      isAdmin ? getAllProductsAdmin() : getAllProducts(),

    staleTime: 5 * 60 * 1000,

    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,
  });
}