"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      transition={{ duration: 0.35 }}
      className="group mx-auto w-full max-w-[300px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-500 hover:shadow-[0_35px_60px_rgba(16,24,40,0.16)]"
    >
      {/* Image Section */}

      <div className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-emerald-50 px-2 pt-2 pb-1">

        {product.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
            {product.badge}
          </span>
        )}

        <div className="relative mx-auto h-56 w-56">

          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain transition duration-500 group-hover:scale-110"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
          />

        </div>

      </div>

      {/* Content */}

      <div className="px-5 pt-4 pb-4">

        <h3 className="text-xl font-bold leading-tight text-slate-900">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {product.size}
        </p>

        <p className="mt-2 text-[13px] leading-5 text-slate-500">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">

          <span className="text-2xl font-black text-emerald-700">
            ₹{product.price.toLocaleString()}
          </span>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white transition-all duration-300 hover:rotate-45 hover:bg-emerald-600">
            <ArrowRight size={18} />
          </button>

        </div>

      </div>

    </motion.div>
  );
}