import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants/queryKeys";
import { updateCartItemQuantity } from "@/services/cart.service";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      updateCartItemQuantity(productId, quantity),
    onSuccess: () => {
      toast.success("Cart updated successfully.");

      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to update cart item."
      );
    },
  });
}