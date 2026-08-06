"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  PRODUCT_PLACEHOLDER_IMAGE,
  getProductImageUrls,
} from "@/utils/product";

export default function ProductCard({ product }) {
  const image = getProductImageUrls(product)[0] || PRODUCT_PLACEHOLDER_IMAGE;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-4xl border border-white/50 bg-white/70 shadow-xl backdrop-blur-xl"
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image Section */}
        <div className="relative overflow-hidden bg-linear-to-b from-sky-50 via-white to-green-50 px-6 pt-6 pb-2">

          {product.badge && (
            <span className="absolute left-5 top-5 z-10 rounded-full bg-(--color-secondary) px-3 py-1 text-xs font-semibold text-white">
              {product.badge}
            </span>
          )}

          <Image
            src={image}
            alt={product.name}
            width={340}
            height={340}
            className="mx-auto h-80 w-auto object-contain transition duration-500 group-hover:scale-110 group-hover:rotate-2"
          />
        </div>

        {/* Content Section */}
        <div className="px-6 pt-4 pb-6">

          <h3 className="text-[26px] font-bold leading-tight text-slate-900">
            {product.name}
          </h3>

          <p className="mt-1 text-[17px] text-slate-500">
            {product.volume}
          </p>

          <div className="mt-3 flex items-center justify-between">

            <h4 className="text-[32px] font-black leading-none text-(--color-primary)">
              {product.price}
            </h4>

            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-primary) text-white transition-all duration-300 hover:scale-110 hover:bg-(--color-secondary)">
              <ArrowRight size={20} />
            </button>

          </div>

        </div>
      </Link>
    </motion.div>
  );
}