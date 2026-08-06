import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants/queryKeys";
import { addItemToCart } from "@/services/cart.service";

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }) => {
      let response;

      for (let index = 0; index < quantity; index += 1) {
        // The cart API increments one item per request.
        response = await addItemToCart(productId);
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Added to cart.");

      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to add item to cart."
      );
    },
  });
}