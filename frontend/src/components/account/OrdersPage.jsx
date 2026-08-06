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
    <div className="grid gap-5 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
              <div className="border-b border-slate-100 bg-slate-50 p-5 md:border-b-0 md:border-r">
                <Skeleton className="aspect-square w-full rounded-2xl" />
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>

                <Skeleton className="h-10 w-36 rounded-full" />
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
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-38px_rgba(15,23,42,0.35)]">
      <CardContent className="p-0">
        <div className="grid gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
          <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#f8fafc,white)] p-5 md:border-b-0 md:border-r">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              {image ? (
                <Image
                  src={image}
                  alt={`Preview for order ${order.orderNumber}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 180px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <PackageSearch className="size-12" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                    Order #{order.orderNumber}
                  </p>

                  <Badge
                    variant="outline"
                    className={cn(
                      "border",
                      getStatusBadgeClass(ORDER_STATUS_STYLES, order.orderStatus)
                    )}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={cn(
                      "border",
                      getStatusBadgeClass(PAYMENT_STATUS_STYLES, order.paymentInfo?.status)
                    )}
                  >
                    {getStatusLabel(order.paymentInfo?.status)}
                  </Badge>
                </div>

                <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  {formatDate(order.createdAt)}
                </h2>

                <p className="max-w-xl text-sm leading-6 text-slate-500">
                  {previewNames || "No product preview available"}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white text-(--color-secondary) shadow-sm">
                  <ArrowRight className="size-4 -rotate-45" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Total Amount
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Payment Method
                </p>
                <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                  {order.paymentInfo?.method || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Total Items
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {itemCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2 xl:col-span-1">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Order Date
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <PackageSearch className="size-4 text-(--color-secondary)" />
                <span className="truncate">{previewNames || "Item preview unavailable"}</span>
              </div>

              <Button asChild className="h-11 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-5 text-white shadow-sm hover:opacity-95">
                <Link href={`/account/orders/${order._id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Customer "My Orders" page.
 *
 * @returns {JSX.Element} Rendered orders experience for the authenticated customer.
 */
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
        <div className="grid gap-5 lg:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}