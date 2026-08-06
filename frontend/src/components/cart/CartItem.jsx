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
  const displayPrice = Number(item.currentPrice ?? item.priceAtAdd ?? 0);
  const itemSubtotal = displayPrice * Number(item.quantity ?? 0);
  const isProductRemoved = item.deleted || !item.productId;
  const isOutOfStock = !isProductRemoved && Number(item.stock ?? 0) === 0;
  const hasInsufficientStock =
    !isProductRemoved && Number(item.stock ?? 0) > 0 && Number(item.quantity ?? 0) > Number(item.stock ?? 0);
  const isInactive = !isProductRemoved && item.isActive === false;
  const isUnavailable =
    Boolean(item.unavailable) || isProductRemoved || isInactive || isOutOfStock || hasInsufficientStock;
  const disableDecrease = isUpdating || isRemoving || isProductRemoved || isInactive;
  const disableIncrease =
    isUpdating || isRemoving || isProductRemoved || isInactive || isOutOfStock || hasInsufficientStock;
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
        "flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        isUnavailable && "opacity-60"
      )}
    >
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-slate-50">
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

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {item.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">{item.size}</p>

          {statusLabel && (
            <div className="mt-2">
              <Badge variant={hasInsufficientStock ? "warning" : "destructive"}>
                {statusLabel}
              </Badge>
            </div>
          )}

          <p className="mt-3 text-lg font-bold text-emerald-700">
            {formatCurrency(displayPrice)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div
          className={cn(
            "flex items-center overflow-hidden rounded-xl border",
            hasInsufficientStock && "border-amber-300 bg-amber-50"
          )}
        >
          <button
            type="button"
            className="p-3 hover:bg-slate-100 disabled:hover:bg-transparent"
            disabled={disableDecrease || Number(item.quantity ?? 0) <= 0}
            onClick={() => onDecrease?.(item)}
          >
            <Minus size={18} />
          </button>

          <span className="w-12 text-center font-semibold">
            {item.quantity}
          </span>

          <button
            type="button"
            className="p-3 hover:bg-slate-100 disabled:hover:bg-transparent"
            disabled={disableIncrease || Number(item.quantity ?? 0) >= Number(item.stock ?? 0)}
            onClick={() => onIncrease?.(item)}
          >
            <Plus size={18} />
          </button>
        </div>

        <p className="w-20 text-right text-lg font-bold">
          {formatCurrency(itemSubtotal)}
        </p>

        <button
          type="button"
          className="text-slate-400 hover:text-red-500 disabled:pointer-events-none disabled:opacity-50"
          disabled={isUpdating || isRemoving}
          aria-busy={isRemoving ? "true" : undefined}
          onClick={() => onRemove?.(item)}
        >
          {isRemoving ? <Loader2 size={20} className="animate-spin" /> : <X size={20} />}
        </button>
      </div>
    </div>
  );
}