export default function OrderSummary() {
  return (
    <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Order Summary
      </h2>

      <div className="mt-8 space-y-4">

        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>₹1,198</span>
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
          <span>₹1,198</span>
        </div>

      </div>

      <button className="mt-8 w-full rounded-xl bg-emerald-700 py-4 font-semibold text-white transition hover:bg-emerald-600">
        Proceed to Checkout
      </button>

      <p className="mt-4 text-center text-sm text-slate-500">
        🔒 Secure Checkout
      </p>

    </div>
  );
}