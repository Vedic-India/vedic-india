"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, PackageSearch, RefreshCcw, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";
import { useCancelOrder } from "@/hooks/mutations/useCancelOrder";
import { useOrder } from "@/hooks/queries/useOrder";
import { cn } from "@/lib/utils";

const ORDER_STATUS_STYLES = {
  placed: "bg-sky-100 text-sky-700 border-sky-200",
  confirmed: "bg-violet-100 text-violet-700 border-violet-200",
  shipped: "bg-amber-100 text-amber-700 border-amber-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

const PAYMENT_STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  processing: "bg-sky-100 text-sky-700 border-sky-200",
  paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
  refunded: "bg-slate-100 text-slate-700 border-slate-200",
};

const TIMELINE_STEPS = ["placed", "confirmed", "shipped", "delivered"];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusLabel(value) {
  if (!value) return "Unknown";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getStatusBadgeClass(map, value) {
  return map[value] || "bg-slate-100 text-slate-700 border-slate-200";
}

function getItemTotal(item) {
  return Number(item?.price || 0) * Number(item?.quantity || 0);
}

function getItemCount(order) {
  return (order?.items || []).reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0
  );
}

function getTimelineIndex(orderStatus) {
  const index = TIMELINE_STEPS.indexOf(orderStatus);
  return index === -1 ? 0 : index;
}

function Breadcrumb({ orderNumber }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500">
      <Link href="/account" className="transition hover:text-slate-900">
        Account
      </Link>
      <ChevronRight className="size-4" />
      <Link href="/account/orders" className="transition hover:text-slate-900">
        Orders
      </Link>
      <ChevronRight className="size-4" />
      <span className="truncate text-slate-900">
        {orderNumber ? `Order #${orderNumber}` : "Order Details"}
      </span>
    </nav>
  );
}

function StatusBadge({ type, value }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border",
        getStatusBadgeClass(type === "payment" ? PAYMENT_STATUS_STYLES : ORDER_STATUS_STYLES, value)
      )}
    >
      {getStatusLabel(value)}
    </Badge>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value || "—"}</span>
    </div>
  );
}

function SummaryCard({ order }) {
  return (
    <SectionCard
      title={`Order #${order.orderNumber}`}
      description={`Placed on ${formatDate(order.createdAt)}`}
    >
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Order Number</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{order.orderNumber}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Order Date</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(order.createdAt)}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Order Status</p>
            <div className="mt-2">
              <StatusBadge value={order.orderStatus} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Payment Status</p>
            <div className="mt-2">
              <StatusBadge type="payment" value={order.paymentInfo?.status} />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function OrderItemsCard({ order }) {
  return (
    <SectionCard
      title="Order Items"
      description="Every item included in this order."
    >
      <div className="space-y-4">
        {(order.items || []).map((item) => {
          const itemTotal = getItemTotal(item);
          return (
            <div
              key={`${item.product}-${item.slug || item.name}`}
              className="rounded-3xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-5">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <PackageSearch className="size-8" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      {item.slug ? (
                        <Link
                          href={`/products/${item.slug}`}
                          className="block text-base font-semibold text-slate-900 transition hover:text-(--color-secondary) hover:underline"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <h3 className="text-base font-semibold text-slate-900">
                          {item.name}
                        </h3>
                      )}

                      {item.slug ? (
                        <Link
                          href={`/products/${item.slug}`}
                          className="inline-flex items-center gap-1 text-sm text-(--color-secondary) transition hover:underline"
                        >
                          View product
                          <ChevronRight className="size-3.5" />
                        </Link>
                      ) : null}
                    </div>

                    <div className="text-sm text-slate-500">
                      Qty <span className="font-medium text-slate-900">{item.quantity}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                    <div>
                      <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">Unit Price</span>
                      <span className="mt-1 block font-medium text-slate-900">{formatCurrency(item.price)}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">Total Price</span>
                      <span className="mt-1 block font-medium text-slate-900">{formatCurrency(itemTotal)}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">Quantity</span>
                      <span className="mt-1 block font-medium text-slate-900">{item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function PriceSummaryCard({ order }) {
  const priceRows = [
    { label: "Subtotal", value: formatCurrency(order.itemsTotal) },
    { label: "Shipping", value: formatCurrency(order.shippingFee) },
  ];

  if (order.taxAmount !== undefined && order.taxAmount !== null) {
    priceRows.push({ label: "Tax", value: formatCurrency(order.taxAmount) });
  }

  if (order.discountAmount !== undefined && order.discountAmount !== null) {
    priceRows.push({ label: "Discount", value: `- ${formatCurrency(order.discountAmount)}` });
  }

  return (
    <SectionCard title="Price Summary" description="A quick breakdown of the final amount.">
      <div className="space-y-1">
        {priceRows.map((row) => (
          <DetailRow key={row.label} label={row.label} value={row.value} />
        ))}

        <Separator className="my-2" />

        <DetailRow label="Grand Total" value={formatCurrency(order.totalAmount)} />
      </div>
    </SectionCard>
  );
}

function ShippingAddressCard({ order }) {
  const address = order.shippingAddress || {};
  const fullAddress = [address.addressLine1, address.addressLine2].filter(Boolean).join(", ");

  return (
    <SectionCard title="Shipping Address" description="The delivery destination saved for this order.">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-900">{address.fullName || "—"}</p>
        <p className="text-sm text-slate-600">{address.phone || "—"}</p>
        <p className="text-sm leading-6 text-slate-600">{fullAddress || "—"}</p>
        <p className="text-sm text-slate-600">
          {[address.city, address.state, address.pincode].filter(Boolean).join(", ") || "—"}
        </p>
      </div>
    </SectionCard>
  );
}

function PaymentInfoCard({ order }) {
  return (
    <SectionCard title="Payment Information" description="A summary of the payment captured for this order.">
      <div className="space-y-1">
        <DetailRow label="Payment Method" value={order.paymentInfo?.method || "—"} />
        <DetailRow
          label="Payment Status"
          value={<StatusBadge type="payment" value={order.paymentInfo?.status} />}
        />
        <DetailRow
          label="Transaction ID"
          value={order.paymentInfo?.razorpayPaymentId || order.paymentInfo?.paymentId || "—"}
        />
        <DetailRow label="Paid At" value={formatDateTime(order.paymentInfo?.paidAt)} />
      </div>
    </SectionCard>
  );
}

function TimelineItem({ label, active, completed, cancelled }) {
  return (
    <li className="relative pl-9">
      <span
        className={cn(
          "absolute left-0 top-1.5 flex size-5 items-center justify-center rounded-full border text-[10px] font-semibold",
          cancelled
            ? "border-rose-200 bg-rose-100 text-rose-700"
            : active
              ? "border-(--color-secondary) bg-(--color-secondary) text-white"
              : completed
                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                : "border-slate-200 bg-white text-slate-400"
        )}
      >
        {cancelled ? "!" : completed || active ? "✓" : "•"}
      </span>

      <div
        className={cn(
          "rounded-2xl border px-4 py-3",
          cancelled
            ? "border-rose-200 bg-rose-50"
            : active
              ? "border-(--color-secondary)/20 bg-emerald-50"
              : completed
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-slate-200 bg-slate-50"
        )}
      >
        <p className={cn(
          "text-sm font-medium",
          cancelled
            ? "text-rose-700"
            : active
              ? "text-(--color-secondary)"
              : completed
                ? "text-emerald-700"
                : "text-slate-500"
        )}>
          {label}
        </p>
      </div>
    </li>
  );
}

function OrderTimeline({ order }) {
  const currentIndex = getTimelineIndex(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <SectionCard title="Order Timeline" description="Track how the order progressed over time.">
      <ol className="space-y-3">
        {TIMELINE_STEPS.map((step, index) => (
          <TimelineItem
            key={step}
            label={getStatusLabel(step)}
            active={currentIndex === index && !isCancelled}
            completed={!isCancelled && index < currentIndex}
          />
        ))}

        {isCancelled ? (
          <TimelineItem label="Cancelled" active cancelled />
        ) : null}
      </ol>
    </SectionCard>
  );
}

function CancelOrderCard({ orderId, orderStatus }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cancelOrderMutation = useCancelOrder();

  if (!["placed", "confirmed"].includes(orderStatus)) {
    return null;
  }

  const handleConfirmCancel = async () => {
    await cancelOrderMutation.mutateAsync(orderId);
    setIsDialogOpen(false);
  };

  return (
    <Card className="border-rose-200 bg-rose-50/60">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-semibold text-rose-700">Cancel Order</p>
          <p className="mt-1 text-sm text-slate-600">
            Cancel this order if you no longer want to proceed.
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDialogOpen(true)}
            disabled={cancelOrderMutation.isPending}
            className="h-11 rounded-full px-5"
          >
            {cancelOrderMutation.isPending
              ? "Cancelling..."
              : "Cancel Order"}
          </Button>

          <DialogContent className="bg-white rounded-xl shadow-xl border border-slate-200">
            <DialogHeader>
              <DialogTitle>Cancel this order?</DialogTitle>

              <DialogDescription>
                Are you sure you want to cancel this order? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={cancelOrderMutation.isPending}
              >
                Keep Order
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={cancelOrderMutation.isPending}
              >
                {cancelOrderMutation.isPending
                  ? "Cancelling..."
                  : "Confirm Cancel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-64" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-6 w-48" />
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-6 w-40" />
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)]">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-56" />
                    <Skeleton className="h-4 w-32" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="space-y-4 p-6">
                <Skeleton className="h-5 w-44" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <Card className="border-rose-200 bg-rose-50/60">
      <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-600">
            Unable to load order
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{message}</p>
        </div>

        <Button type="button" variant="outline" onClick={onRetry} className="h-11 rounded-full border-rose-200 bg-white px-5 text-rose-700 hover:bg-rose-50">
          <RefreshCcw className="mr-2 size-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

function NotFoundState() {
  return (
    <Card className="overflow-hidden border-dashed border-slate-300 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))]">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <div className="flex size-18 items-center justify-center rounded-full bg-emerald-50 text-(--color-secondary) shadow-inner">
          <ShoppingBag className="size-8" />
        </div>

        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Order not found
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          The order you&apos;re looking for may have been removed or the link is no longer valid.
        </p>

        <Button asChild className="mt-8 h-11 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-5 text-white shadow-sm hover:opacity-95">
          <Link href="/account/orders">Back to Orders</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Customer order details page.
 *
 * @param {Object} props - Component props.
 * @param {string} props.orderId - Order ID from the route.
 * @returns {JSX.Element} Rendered order details experience.
 */
export default function OrderDetailsPage({ orderId }) {
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);

  const isNotFound = error?.response?.status === 404;

  return (
    <section className="space-y-6">
      <Breadcrumb orderNumber={order?.orderNumber} />

      {isLoading ? (
        <DetailsSkeleton />
      ) : isError ? (
        isNotFound ? (
          <NotFoundState />
        ) : (
          <ErrorState
            message={error?.response?.data?.message || error?.message || "Unable to load this order right now."}
            onRetry={() => refetch()}
          />
        )
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
          <div className="space-y-6">
            <SummaryCard order={order} />
            <OrderItemsCard order={order} />
            <OrderTimeline order={order} />
            <CancelOrderCard orderId={order._id} orderStatus={order.orderStatus} />
          </div>

          <div className="space-y-6">
            <PriceSummaryCard order={order} />
            <PaymentInfoCard order={order} />
            <ShippingAddressCard order={order} />
          </div>
        </div>
      )}
    </section>
  );
}