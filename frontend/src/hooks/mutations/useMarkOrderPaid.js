import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { markOrderPaid } from "@/services/order.service";
import { queryKeys } from "@/constants/queryKeys";

/**
 * Mark a COD order as paid.
 *
 * @returns {import("@tanstack/react-query").UseMutationResult<any, Error, string>} Mutation result for marking an order paid.
 */
export function useMarkOrderPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markOrderPaid,
    onSuccess: (_response, orderId) => {
      toast.success("Order marked as paid successfully.");

      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrder(orderId) });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? "Failed to mark order as paid.");
    },
  });
}