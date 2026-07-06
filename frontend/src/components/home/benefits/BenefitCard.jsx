"use client";

import { motion } from "framer-motion";

export default function BenefitCard({ benefit }) {
  const Icon = benefit.icon;

  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      className="group rounded-[30px] border border-white/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl"
    >
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-sky-100 transition group-hover:scale-110">
        <Icon
          size={30}
          className="text-[var(--color-secondary)]"
        />
      </div>

      <h3 className="text-2xl font-bold">
        {benefit.title}
      </h3>

      <p className="mt-4 leading-8 text-gray-500">
        {benefit.description}
      </p>
    </motion.div>
  );
}