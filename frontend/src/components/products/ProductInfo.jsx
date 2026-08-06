"use client";

import { useState } from "react";
import {
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";

import { useAddCartItem } from "@/hooks/mutations/useAddCartItem";
import { getProductVolumeBySlug } from "@/components/home/products/products";

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const addCartItemMutation = useAddCartItem();

  const stockLimit = Number(product?.stock ?? 0);
  const maxQuantity = Number.isFinite(stockLimit)
    ? Math.max(0, Math.min(stockLimit, 10))
    : 10;
  const isOutOfStock = Number(product?.stock ?? 0) <= 0;
  const disableStepper = addCartItemMutation.isPending || isOutOfStock;
  const productPrice = Number(product?.price ?? 0);
  const benefits = Array.isArray(product?.benefits) ? product.benefits : [];
  const productVolume = getProductVolumeBySlug(product?.slug) || product?.size;

  const handleAddToCart = () => {
    if (addCartItemMutation.isPending || isOutOfStock) {
      return;
    }

    addCartItemMutation.mutate({
      productId: product._id,
      quantity,
    });
  };

  return (
    <div className="flex flex-col justify-start">

      {/* Product Name */}

      <h1 className="text-3xl font-extrabold leading-tight text-slate-900 lg:text-5xl">
        {product.name}
      </h1>

      {productVolume && (
        <p className="mt-1 text-base font-medium text-slate-500">
          {productVolume}
        </p>
      )}

      {/* Rating */}

      {/* <div className="mt-3 flex items-center gap-3">

        <div className="flex text-amber-400">

          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              fill="currentColor"
            />
          ))}

        </div>

        <span className="text-sm text-slate-500">
          4.9 (126 Reviews)
        </span>

      </div> */}

      {/* Price */}

      <div className="mt-5">

        <h2 className="text-4xl font-black text-emerald-700 lg:text-5xl">
          ₹{productPrice.toLocaleString("en-IN")}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Inclusive of all taxes
        </p>

      </div>

      {/* Description */}

      <p className="mt-5 max-w-lg text-[15px] leading-7 text-slate-600">
        {product.description}
      </p>

      {/* Benefits */}

      <div className="mt-5 space-y-2.5">

        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex items-center gap-3"
          >

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">

              <Check size={15} />

            </div>

            <span className="text-[16px] text-slate-700">
              {benefit}
            </span>

          </div>
        ))}

      </div>

      {/* Quantity */}

      <div className="mt-6">

        <p className="mb-2 text-sm font-semibold text-slate-900">
          Quantity
        </p>

        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-300">

          <button
            type="button"
            onClick={() =>
              setQuantity((q) => Math.max(1, q - 1))
            }
            disabled={disableStepper}
            className="p-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Minus size={18} />
          </button>

          <span className="w-14 text-center font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              setQuantity((q) => Math.min(maxQuantity, q + 1))
            }
            disabled={disableStepper || quantity >= maxQuantity}
            className="p-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
          </button>

        </div>

      </div>

      {/* Buttons */}

      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addCartItemMutation.isPending || isOutOfStock}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-7 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >

          <ShoppingCart size={18} />

          {addCartItemMutation.isPending ? "Adding..." : "Add to Cart"}

        </button>

        {/* <button className="rounded-xl border border-slate-300 px-7 py-3 text-[15px] font-semibold text-slate-700 transition-all duration-300 hover:border-emerald-700 hover:text-emerald-700 hover:shadow-md">

          Buy Now

        </button> */}

      </div>

    </div>
  );
}