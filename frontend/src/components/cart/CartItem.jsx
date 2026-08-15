"use client";

import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";

export default function CartItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}) {
  const displayPrice = Number(
    item.currentPrice ?? item.priceAtAdd ?? 0
  );

  const quantity = Number(item.quantity ?? 0);
  const stock = Number(item.stock ?? 0);
  const itemSubtotal = displayPrice * quantity;

  const isProductRemoved = item.deleted || !item.productId;

  const isOutOfStock =
    !isProductRemoved && stock === 0;

  const hasInsufficientStock =
    !isProductRemoved &&
    stock > 0 &&
    quantity > stock;

  const isInactive =
    !isProductRemoved && item.isActive === false;

  const isUnavailable =
    Boolean(item.unavailable) ||
    isProductRemoved ||
    isInactive ||
    isOutOfStock ||
    hasInsufficientStock;

  const disableDecrease =
    isUpdating ||
    isRemoving ||
    isProductRemoved ||
    isInactive;

  const disableIncrease =
    isUpdating ||
    isRemoving ||
    isProductRemoved ||
    isInactive ||
    isOutOfStock ||
    hasInsufficientStock;

  const statusLabel = isProductRemoved
    ? "Product Removed"
    : isInactive
    ? "Unavailable"
    : isOutOfStock
    ? "Out of Stock"
    : hasInsufficientStock
    ? `Only ${item.stock} item(s) available`
    : null;

  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6",
        isUnavailable && "opacity-60"
      )}
    >
      {/* Main row */}
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">

        {/* Product */}
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">

          {/* Image */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:h-24 sm:w-24">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name ?? "Cart item"}
                fill
                className={cn(
                  "object-contain p-2",
                  isUnavailable && "grayscale"
                )}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <X size={26} />
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-7 text-slate-900">
              {item.name}
            </h3>

            {item.size && (
              <p className="mt-1 text-sm text-slate-500">
                {item.size}
              </p>
            )}

            {statusLabel && (
              <div className="mt-2">
                <Badge
                  variant={
                    hasInsufficientStock
                      ? "warning"
                      : "destructive"
                  }
                >
                  {statusLabel}
                </Badge>
              </div>
            )}

            <p className="mt-2 text-lg font-bold text-emerald-700 sm:mt-3">
              {formatCurrency(displayPrice)}
            </p>
          </div>
        </div>

        {/* Desktop controls */}
        <div className="hidden shrink-0 items-center gap-8 sm:flex">

          {/* Quantity */}
          <div
            className={cn(
              "flex items-center overflow-hidden rounded-xl border",
              hasInsufficientStock &&
                "border-amber-300 bg-amber-50"
            )}
          >
            <button
              type="button"
              className="p-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              disabled={
                disableDecrease || quantity <= 0
              }
              onClick={() => onDecrease?.(item)}
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>

            <span className="w-12 text-center font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              className="p-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              disabled={
                disableIncrease ||
                quantity >= stock
              }
              onClick={() => onIncrease?.(item)}
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Subtotal */}
          <p className="w-20 text-right text-lg font-bold text-slate-900">
            {formatCurrency(itemSubtotal)}
          </p>

          {/* Remove */}
          <button
            type="button"
            className="text-slate-400 transition hover:text-red-500 disabled:pointer-events-none disabled:opacity-50"
            disabled={isUpdating || isRemoving}
            aria-label={`Remove ${item.name ?? "item"}`}
            aria-busy={isRemoving ? "true" : undefined}
            onClick={() => onRemove?.(item)}
          >
            {isRemoving ? (
              <Loader2
                size={20}
                className="animate-spin"
              />
            ) : (
              <X size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile controls */}
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:hidden">

        {/* Quantity */}
        <div
          className={cn(
            "flex items-center overflow-hidden rounded-xl border",
            hasInsufficientStock &&
              "border-amber-300 bg-amber-50"
          )}
        >
          <button
            type="button"
            className="p-2.5 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            disabled={
              disableDecrease || quantity <= 0
            }
            onClick={() => onDecrease?.(item)}
            aria-label="Decrease quantity"
          >
            <Minus size={18} />
          </button>

          <span className="w-10 text-center font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            className="p-2.5 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            disabled={
              disableIncrease ||
              quantity >= stock
            }
            onClick={() => onIncrease?.(item)}
            aria-label="Increase quantity"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Subtotal */}
        <p className="ml-auto text-lg font-bold text-slate-900">
          {formatCurrency(itemSubtotal)}
        </p>

        {/* Remove */}
        <button
          type="button"
          className="shrink-0 text-slate-400 transition hover:text-red-500 disabled:pointer-events-none disabled:opacity-50"
          disabled={isUpdating || isRemoving}
          aria-label={`Remove ${item.name ?? "item"}`}
          aria-busy={isRemoving ? "true" : undefined}
          onClick={() => onRemove?.(item)}
        >
          {isRemoving ? (
            <Loader2
              size={20}
              className="animate-spin"
            />
          ) : (
            <X size={20} />
          )}
        </button>
      </div>
    </div>
  );
}