import AdminOrderDetailsPage from "@/components/admin/AdminOrderDetailsPage";
/**
 * Admin order details route entry.
 *
 * @param {Object} props - Route props.
 * @param {Object} props.params - Route params.
 * @param {string} props.params.orderId - Order ID.
 * @returns {JSX.Element} Rendered admin order detail experience.
 */
export default async function AdminOrderDetailsRoute({ params }) {
  const { orderId } = await params;

  return <AdminOrderDetailsPage orderId={orderId} />;
  return <AdminOrderDetailsPage orderId={params.orderId} />;
}