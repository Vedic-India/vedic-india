"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCcw, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/queries/useCart";
import { useUpdateCartItem } from "@/hooks/mutations/useUpdateCartItem";
import { useRemoveCartItem } from "@/hooks/mutations/useRemoveCartItem";
import { useClearCart } from "@/hooks/mutations/useClearCart";

import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";

function CartSkeleton() {
  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <Skeleton className="h-10 w-56 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-36 w-full rounded-2xl" />
            ))}
          </div>

          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </section>
  );
}

function CartErrorState({ message, onRetry }) {
  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-8 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm">
            <AlertTriangle className="size-6" />
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-slate-900">
            Failed to load cart
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            className="mt-6 h-11 rounded-full border-rose-200 bg-white px-5 text-rose-700 hover:bg-rose-50"
          >
            <RefreshCcw className="mr-2 size-4" />
            Retry
          </Button>
        </div>
      </div>
    </section>
  );
}

function EmptyCartState() {
  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex size-18 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shadow-inner">
            <ShoppingBag className="size-8" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Browse products and add what you need to continue.
          </p>

          <Button asChild className="mt-8 h-11 rounded-full px-6">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function getWarningMessage(items, hasUnavailableItems) {
  const hasOutOfStockItems = items.some(
    (item) => !item.deleted && Number(item.stock ?? 0) === 0
  );
  const hasInsufficientStockItems = items.some(
    (item) =>
      !item.deleted && Number(item.stock ?? 0) > 0 && Number(item.quantity ?? 0) > Number(item.stock ?? 0)
  );

  if (hasUnavailableItems) {
    return "Some items in your cart are unavailable. Please remove or update them before checkout.";
  }

  if (hasOutOfStockItems || hasInsufficientStockItems) {
    return "Some items exceed the available stock.";
  }

  return "";
}

export default function CartLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data, isLoading, isError, error, refetch } = useCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const cart = data ?? {
    items: [],
    subtotal: 0,
    totalItems: 0,
    hasUnavailableItems: false,
  };

  const items = cart.items ?? [];
  const subtotal = cart.subtotal ?? 0;
  const itemCount = items.length;
  const warningMessage = getWarningMessage(items, cart.hasUnavailableItems);
  const checkoutDisabled =
    itemCount === 0 ||
    Boolean(warningMessage) ||
    isAuthLoading ||
    updateCartItemMutation.isPending ||
    removeCartItemMutation.isPending ||
    clearCartMutation.isPending;

  const handleIncrease = (item) => {
    if (!item?.productId) return;

    updateCartItemMutation.mutate({
      productId: item.productId,
      quantity: Number(item.quantity ?? 0) + 1,
    });
  };

  const handleDecrease = (item) => {
    if (!item?.productId) return;

    updateCartItemMutation.mutate({
      productId: item.productId,
      quantity: Math.max(0, Number(item.quantity ?? 0) - 1),
    });
  };

  const handleRemove = (item) => {
    if (!item?.productId) return;

    removeCartItemMutation.mutate(item.productId);
  };

  const handleCheckout = () => {
    if (checkoutDisabled) {
      return;
    }

    router.push(isAuthenticated ? "/checkout" : "/login");
  };

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (isError) {
    return (
      <CartErrorState
        message={error?.response?.data?.message ?? "Something went wrong. Please try again."}
        onRetry={() => refetch()}
      />
    );
  }

  if (itemCount === 0) {
    return <EmptyCartState />;
  }

  return (
    <section className="bg-slate-50 pt-30 pb-14">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-10 text-4xl font-bold">
          Your Cart
          <span className="ml-2 text-lg font-normal text-slate-500">
            ({itemCount} Items)
          </span>
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
                isUpdating={
                  updateCartItemMutation.isPending &&
                  updateCartItemMutation.variables?.productId === item.productId
                }
                isRemoving={
                  removeCartItemMutation.isPending &&
                  removeCartItemMutation.variables === item.productId
                }
              />
            ))}
          </div>

          <OrderSummary
            subtotal={subtotal}
            hasUnavailableItems={Boolean(cart.hasUnavailableItems)}
            hasOutOfStockItems={items.some(
              (item) => !item.deleted && Number(item.stock ?? 0) === 0
            )}
            warningMessage={warningMessage}
            onCheckout={handleCheckout}
            isCheckoutDisabled={checkoutDisabled}
            isCheckoutPending={clearCartMutation.isPending}
          />
        </div>
      </div>
    </section>
  );
}