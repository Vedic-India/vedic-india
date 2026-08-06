import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createProduct } from "@/services/product.service";
import { queryKeys } from "@/constants/queryKeys";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: (response) => {
      toast.success(response.message);

      queryClient.invalidateQueries({
        queryKey: queryKeys.products,
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
        "Failed to create product."
      );
    },
  });
}