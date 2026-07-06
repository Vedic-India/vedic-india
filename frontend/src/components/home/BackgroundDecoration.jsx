"use client";

import { motion } from "framer-motion";

export default function BackgroundDecoration() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        className="pointer-events-none fixed -left-40 top-40 h-[500px] w-[500px] rounded-full bg-emerald-200/20 blur-[160px]"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
        }}
        className="pointer-events-none fixed right-0 top-80 h-[450px] w-[450px] rounded-full bg-sky-200/20 blur-[160px]"
      />
    </>
  );
}