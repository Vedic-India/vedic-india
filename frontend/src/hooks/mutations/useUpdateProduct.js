import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProduct } from "@/services/product.service";
import { queryKeys } from "@/constants/queryKeys";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, productData }) =>
      updateProduct(slug, productData),

    onSuccess: (response, variables) => {
      toast.success(response.message);

      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.slug),
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update product."
      );
    },
  });
}