"use client";

import { AlertTriangle } from "lucide-react";

import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderSummary({
  subtotal = 0,
  hasUnavailableItems = false,
  hasOutOfStockItems = false,
  warningMessage = "",
  onCheckout,
  isCheckoutDisabled = false,
  isCheckoutPending = false,
}) {
  return (
    <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Order Summary
      </h2>

      {(warningMessage || hasUnavailableItems || hasOutOfStockItems) && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>{warningMessage}</p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">

        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Shipping</span>
          <span className="font-medium text-emerald-700">
            Free
          </span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

      </div>

      <button
        type="button"
        disabled={isCheckoutDisabled || isCheckoutPending}
        onClick={onCheckout}
        className="mt-8 w-full rounded-xl bg-emerald-700 py-4 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-700 disabled:opacity-60"
      >
        Proceed to Checkout
      </button>

      <p className="mt-4 text-center text-sm text-slate-500">
        🔒 Secure Checkout
      </p>

    </div>
  );
}