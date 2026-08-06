import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toggleProductStatus } from "@/services/product.service";
import { queryKeys } from "@/constants/queryKeys";

export function useToggleProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleProductStatus,

    onSuccess: (response, slug) => {
      toast.success(
        response?.message ?? "Product status updated."
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.product(slug),
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update product status."
      );
    },
  });
}