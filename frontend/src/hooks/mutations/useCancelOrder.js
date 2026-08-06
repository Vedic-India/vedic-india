import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelOrder } from "@/services/order.service";
import { queryKeys } from "@/constants/queryKeys";

/**
 * Cancel a customer order.
 *
 * @returns {import("@tanstack/react-query").UseMutationResult<any, Error, string>} Mutation result for cancelling an order.
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (_response, orderId) => {
      toast.success("Order cancelled successfully.");

      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.order(orderId) });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? "Failed to cancel order.");
    },
  });
}