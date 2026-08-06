"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  RefreshCcw,
  Search,
  ShoppingBag,
  PackageSearch,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";
import { useAdminOrders } from "@/hooks/queries/useAdminOrders";
import { cn } from "@/lib/utils";

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "placed", label: "Placed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All payment statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

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
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatStatus(value) {
  if (!value) return "Unknown";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getBadgeClass(map, value) {
  return map[value] || "bg-slate-100 text-slate-700 border-slate-200";
}

function getItemCount(order) {
  return (order?.items || []).reduce(
    (total, item) => total + (Number(item?.quantity) || 0),
    0
  );
}

function getCustomerName(order) {
  return order?.user?.name || order?.user?.email || "—";
}

function getFirstItemImage(order) {
  return order?.items?.[0]?.image || null;
}

function OrdersTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="hidden md:block">
          <div className="border-b border-slate-200 px-6 py-4">
            <Skeleton className="h-5 w-full" />
          </div>

          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4 md:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-3xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onReset }) {
  return (
    <Card className="border-dashed border-slate-300 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))]">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <div className="flex size-18 items-center justify-center rounded-full bg-emerald-50 text-(--color-secondary) shadow-inner">
          <ShoppingBag className="size-8" />
        </div>

        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          No orders found
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          Try adjusting the filters or clear them to load the full order list.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="mt-8 h-11 rounded-full border-slate-200 px-5"
        >
          Reset Filters
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

          <p className="text-sm leading-6 text-slate-700">{message}</p>
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

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="space-y-2">
      <span className="block text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-(--color-secondary) focus:ring-2 focus:ring-(--color-secondary)/20"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterBar({ search, onSearchChange, orderStatus, onOrderStatusChange, paymentStatus, onPaymentStatusChange, onReset }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <label className="w-full space-y-2 lg:max-w-xl">
            <span className="block text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              Search by Order Number
            </span>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search order number"
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-(--color-secondary) focus:ring-2 focus:ring-(--color-secondary)/20"
              />
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2 lg:w-auto lg:min-w-130 xl:min-w-155">
            <FilterSelect
              label="Order Status"
              value={orderStatus}
              onChange={onOrderStatusChange}
              options={ORDER_STATUS_OPTIONS}
            />

            <FilterSelect
              label="Payment Status"
              value={paymentStatus}
              onChange={onPaymentStatusChange}
              options={PAYMENT_STATUS_OPTIONS}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onReset} className="h-10 rounded-full px-4">
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OrdersMobileCard({ order }) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] md:hidden">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {getFirstItemImage(order) ? (
              <Image
                src={getFirstItemImage(order)}
                alt={`Order ${order.orderNumber}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">
                <PackageSearch className="size-6" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Order #{order.orderNumber}</p>
            <p className="mt-1 text-sm text-slate-500">{getCustomerName(order)}</p>
            <p className="mt-1 text-xs text-slate-500">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Items</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{getItemCount(order)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Total</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{formatCurrency(order.totalAmount)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Order Status</p>
            <Badge variant="outline" className={cn("mt-2 border", getBadgeClass(ORDER_STATUS_STYLES, order.orderStatus))}>
              {formatStatus(order.orderStatus)}
            </Badge>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Payment Status</p>
            <Badge variant="outline" className={cn("mt-2 border", getBadgeClass(PAYMENT_STATUS_STYLES, order.paymentInfo?.status))}>
              {formatStatus(order.paymentInfo?.status)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Payment Method</p>
            <p className="mt-1 text-sm font-medium capitalize text-slate-900">{order.paymentInfo?.method || "—"}</p>
          </div>

          <Button asChild size="sm" className="rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-4 text-white shadow-sm hover:opacity-95">
            <Link href={`/admin/orders/${order._id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OrdersTable({ orders }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Order Number",
                    "Customer Name",
                    "Order Date",
                    "Items",
                    "Total",
                    "Order Status",
                    "Payment Status",
                    "Payment Method",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {orders.map((order) => (
                  <tr key={order._id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">#{order.orderNumber}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{getCustomerName(order)}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{getItemCount(order)}</td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className={cn("border", getBadgeClass(ORDER_STATUS_STYLES, order.orderStatus))}>
                        {formatStatus(order.orderStatus)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className={cn("border", getBadgeClass(PAYMENT_STATUS_STYLES, order.paymentInfo?.status))}>
                        {formatStatus(order.paymentInfo?.status)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm capitalize text-slate-700">{order.paymentInfo?.method || "—"}</td>
                    <td className="px-5 py-4">
                      <Button asChild variant="outline" size="sm" className="rounded-full px-4">
                        <Link href={`/admin/orders/${order._id}`}>
                          <Eye className="mr-2 size-4" />
                          View Details
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 p-4 md:hidden">
          {orders.map((order) => (
            <OrdersMobileCard key={order._id} order={order} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BottomLoader() {
  return (
    <div className="flex items-center justify-center py-6 text-sm text-slate-500">
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <span className="size-3 animate-spin rounded-full border-2 border-(--color-secondary) border-t-transparent" />
        Loading more orders...
      </span>
    </div>
  );
}

/**
 * Admin orders management page.
 *
 * @returns {JSX.Element} Rendered admin orders dashboard.
 */
export default function AdminOrdersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const filters = useMemo(
    () => ({
      limit: 10,
      search: debouncedSearch.trim(),
      orderStatus,
      paymentStatus,
    }),
    [debouncedSearch, orderStatus, paymentStatus]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useAdminOrders(filters);

  const orders = useMemo(
    () => data?.pages?.flatMap((page) => page.orders || []) || [],
    [data]
  );

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  const handleReset = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setOrderStatus("");
    setPaymentStatus("");
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">
          Admin
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Orders
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Manage and track customer orders.
        </p>
      </div>

      <FilterBar
        search={searchInput}
        onSearchChange={setSearchInput}
        orderStatus={orderStatus}
        onOrderStatusChange={setOrderStatus}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
        onReset={handleReset}
      />

      <Separator />

      {isLoading ? (
        <OrdersTableSkeleton />
      ) : isError ? (
        <ErrorState
          message={error?.response?.data?.message || error?.message || "Unable to load orders right now."}
          onRetry={() => refetch()}
        />
      ) : orders.length === 0 ? (
        <EmptyState onReset={handleReset} />
      ) : (
        <div className="space-y-4">
          <OrdersTable orders={orders} />

          <div ref={loadMoreRef} />

          {isFetchingNextPage ? <BottomLoader /> : null}

          {!hasNextPage ? (
            <div className="py-4 text-center text-sm text-slate-500">
              You&apos;ve reached the end of the order list.
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}