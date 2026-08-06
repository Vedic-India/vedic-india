import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateOrderStatus } from "@/services/order.service";
import { queryKeys } from "@/constants/queryKeys";

/**
 * Update an admin order status.
 *
 * @returns {import("@tanstack/react-query").UseMutationResult<any, Error, { orderId: string; orderStatus: string }>} Mutation result for updating an order status.
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus(orderId, { orderStatus }),
    onSuccess: (_response, variables) => {
      toast.success("Order status updated successfully.");

      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrder(variables.orderId) });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? "Failed to update order status.");
    },
  });
}