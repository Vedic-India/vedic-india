import cartItems from "@/constants/cart";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";

export default function CartLayout() {
  return (
    <section className="bg-slate-50 pt-6 pb-14">

      <div className="mx-auto max-w-7xl px-6">

        <h1 className="mb-10 text-4xl font-bold">
          Your Cart
          <span className="ml-2 text-lg font-normal text-slate-500">
            ({cartItems.length} Items)
          </span>
        </h1>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">

          <div className="space-y-6">

            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}

          </div>

          <OrderSummary />

        </div>

      </div>

    </section>
  );
}