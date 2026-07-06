"use client";

import { motion } from "framer-motion";

export default function FloatingBadge({
  className = "",
  title,
  value,
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
      }}
      className={`absolute rounded-2xl border border-white/40 bg-white/70 p-4 shadow-xl backdrop-blur-xl ${className}`}
    >
      <p className="text-xs text-gray-500">{title}</p>

      <h3 className="mt-1 text-lg font-bold text-[var(--color-primary)]">
        {value}
      </h3>
    </motion.div>
  );
}