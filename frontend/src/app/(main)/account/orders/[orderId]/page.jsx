import OrderDetailsPage from "@/components/account/OrderDetailsPage";

/**
 * Route entry for a single customer order.
 *
 * @param {Object} props - Next.js route props.
 * @param {Object} props.params - Route params.
 * @param {string} props.params.orderId - Order ID.
 * @returns {JSX.Element} Order details page UI.
 */
export default async function AccountOrderDetailsRoute({ params }) {
  const { orderId } = await params;

  return <OrderDetailsPage orderId={orderId} />;
}