"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageSearch, RefreshCcw, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useOrders } from "@/hooks/queries/useOrders";
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
  paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
  refunded: "bg-slate-100 text-slate-700 border-slate-200",
};

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

function getItemCount(order) {
  return (order?.items || []).reduce((total, item) => total + (Number(item?.quantity) || 0), 0);
}

function getPreviewNames(order) {
  return (order?.items || [])
    .map((item) => item?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(" · ");
}

function getFirstItemImage(order) {
  return order?.items?.[0]?.image || null;
}

function getStatusLabel(value) {
  if (!value) return "Unknown";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getStatusBadgeClass(map, value) {
  return map[value] || "bg-slate-100 text-slate-700 border-slate-200";
}

function OrdersSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex min-h-[190px] flex-col md:flex-row">
              {/* Image */}
              <div className="shrink-0 border-b border-slate-100 bg-slate-50 p-4 md:w-[180px] md:border-b-0 md:border-r">
                <Skeleton className="aspect-square w-full rounded-2xl" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-4 w-56" />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-2.5 w-20" />
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-2.5 w-24" />
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </div>

                    <Skeleton className="h-14 w-32 rounded-2xl" />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex gap-3">
                    <Skeleton className="h-12 w-28 rounded-xl" />
                    <Skeleton className="h-12 w-24 rounded-xl" />
                    <Skeleton className="h-12 w-28 rounded-xl" />
                  </div>

                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="overflow-hidden border-dashed border-slate-300 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))]">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <div className="flex size-18 items-center justify-center rounded-full bg-emerald-50 text-(--color-secondary) shadow-inner">
          <ShoppingBag className="size-8" />
        </div>

        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          No orders yet
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          Looks like you haven&apos;t placed your first order.
        </p>

        <Button asChild className="mt-8 h-11 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-5 text-white shadow-sm hover:opacity-95">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <Card className="border-rose-200 bg-rose-50/60">
      <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-600">
            Unable to load orders
          </p>

          <p className="text-sm leading-6 text-slate-700">
            {message}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="h-11 rounded-full border-rose-200 bg-white px-5 text-rose-700 hover:bg-rose-50"
        >
          <RefreshCcw className="mr-2 size-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

function OrderCard({ order }) {
  const itemCount = getItemCount(order);
  const previewNames = getPreviewNames(order);
  const image = getFirstItemImage(order);

  return (
    <Card className="group overflow-hidden border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)]">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div className="shrink-0 border-b border-slate-100 bg-[linear-gradient(180deg,#f8fafc,white)] p-4 sm:w-[150px] sm:border-b-0 sm:border-r">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              {image ? (
                <Image
                  src={image}
                  alt={`Preview for order ${order.orderNumber}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="150px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <PackageSearch className="size-9" />
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
            {/* Top Section */}
            <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_auto]">
              {/* Order Info */}
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">
                  Order #{order.orderNumber}
                </p>

                <h2 className="mt-1.5 text-base font-semibold tracking-tight text-slate-900">
                  {formatDate(order.createdAt)}
                </h2>

                <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                  {previewNames || "No product preview available"}
                </p>
              </div>

              {/* Status + Amount */}
              <div className="grid grid-cols-3 items-start gap-3">
                {/* Order Status */}
                <div className="min-w-[85px]">
                  <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Order Status
                  </p>

                  <Badge
                    variant="outline"
                    className={cn(
                      "whitespace-nowrap border px-2.5 py-0.5 text-xs",
                      getStatusBadgeClass(
                        ORDER_STATUS_STYLES,
                        order.orderStatus
                      )
                    )}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </Badge>
                </div>

                {/* Payment Status */}
                <div className="min-w-[90px]">
                  <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Payment Status
                  </p>

                  <Badge
                    variant="outline"
                    className={cn(
                      "whitespace-nowrap border px-2.5 py-0.5 text-xs",
                      getStatusBadgeClass(
                        PAYMENT_STATUS_STYLES,
                        order.paymentInfo?.status
                      )
                    )}
                  >
                    {getStatusLabel(order.paymentInfo?.status)}
                  </Badge>
                </div>

                {/* Total */}
                <div className="min-w-[115px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Total Amount
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <p className="text-[8px] uppercase tracking-[0.16em] text-slate-400">
                    Payment Method
                  </p>

                  <p className="mt-0.5 text-xs font-medium capitalize text-slate-800">
                    {order.paymentInfo?.method || "—"}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <p className="text-[8px] uppercase tracking-[0.16em] text-slate-400">
                    Total Items
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-slate-800">
                    {itemCount}
                  </p>
                </div>
              </div>

              {/* View Details */}
              <Button
                asChild
                className="h-9 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-4 text-sm text-white shadow-sm hover:opacity-95"
              >
                <Link href={`/account/orders/${order._id}`}>
                  View Details
                  <ArrowRight className="ml-2 size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const { data, isLoading, isError, error, refetch } = useOrders();

  const orders = data?.orders || [];

  return (
    <section className="space-y-8">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">
          Account
        </p>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            My Orders
          </h1>

          <p className="text-sm leading-6 text-slate-500 sm:text-base">
            Track every order you&apos;ve placed, review payment progress, and jump into any order detail instantly.
          </p>
        </div>
      </div>

      {isLoading ? (
        <OrdersSkeleton />
      ) : isError ? (
        <ErrorState
          message={error?.response?.data?.message || error?.message || "Unable to load your orders right now."}
          onRetry={() => refetch()}
        />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}