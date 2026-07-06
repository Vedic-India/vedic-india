"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: 1,
      }}
      className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Scroll
        </span>

        <div className="flex h-12 w-7 justify-center rounded-full border border-gray-300">
          <motion.div
            animate={{
              y: [3, 18, 3],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
            className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--color-secondary)]"
          />
        </div>
      </div>
    </motion.div>
  );
}