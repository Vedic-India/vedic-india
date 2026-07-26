"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

export default function CartItem({ item }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Left */}

      <div className="flex items-center gap-5">

        <div className="relative h-24 w-24 rounded-xl bg-slate-50">

          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain p-2"
          />

        </div>

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            {item.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {item.size}
          </p>

          <p className="mt-3 text-lg font-bold text-emerald-700">
            ₹{item.price}
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-8">

        <div className="flex items-center overflow-hidden rounded-xl border">

          <button className="p-3 hover:bg-slate-100">
            <Minus size={18} />
          </button>

          <span className="w-12 text-center font-semibold">
            {item.quantity}
          </span>

          <button className="p-3 hover:bg-slate-100">
            <Plus size={18} />
          </button>

        </div>

        <p className="w-20 text-right text-lg font-bold">
          ₹{item.price}
        </p>

        <button className="text-slate-400 hover:text-red-500">
          <X size={20} />
        </button>

      </div>

    </div>
  );
}