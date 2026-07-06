"use client";

import { motion } from "framer-motion";

export default function GlassCard({
  title,
  value,
  className = "",
}) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
      }}
      className={`absolute rounded-[28px] border border-white/60 bg-white/65 px-7 py-6 shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur-3xl ${className}`}
    >
      <p className="text-xs text-gray-500">{title}</p>

      <h3 className="mt-2 text-3xl font-black text-[var(--color-primary)]">
        {value}
      </h3>
    </motion.div>
  );
}