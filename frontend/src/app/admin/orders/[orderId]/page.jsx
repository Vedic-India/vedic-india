import AdminOrderDetailsPage from "@/components/admin/AdminOrderDetailsPage";

/**
 * Admin order details route entry.
 *
 * @param {Object} props - Next.js route props.
 * @param {Object} props.params - Route params.
 * @param {string} props.params.orderId - Order ID.
 * @returns {JSX.Element} Admin order details page.
 */
export default function AdminOrderDetailsRoute({ params }) {
  return <AdminOrderDetailsPage orderId={params.orderId} />;
}