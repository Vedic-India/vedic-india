"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.3,
      }}
      className="group overflow-hidden rounded-[32px] border border-white/50 bg-white/70 shadow-xl backdrop-blur-xl"
    >
      <div className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-green-50 p-10">

        <span className="absolute left-5 top-5 rounded-full bg-[var(--color-secondary)] px-3 py-1 text-xs font-semibold text-white">
          {product.badge}
        </span>

        <Image
          src={product.image}
          alt={product.name}
          width={260}
          height={260}
          className="mx-auto h-72 w-auto object-contain transition duration-500 group-hover:scale-110 group-hover:rotate-2"
        />
      </div>

      <div className="space-y-4 p-7">

        <div>
          <h3 className="text-2xl font-bold">
            {product.name}
          </h3>

          <p className="mt-2 text-gray-500">
            {product.volume}
          </p>
        </div>

        <div className="flex items-center justify-between">

          <h4 className="text-3xl font-black text-[var(--color-primary)]">
            {product.price}
          </h4>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition hover:scale-110 hover:bg-[var(--color-secondary)]">
            <ArrowRight size={20} />
          </button>

        </div>

      </div>
    </motion.div>
  );
}