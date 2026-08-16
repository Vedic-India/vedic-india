"use client";

import { motion } from "framer-motion";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="mt-8 mr-0 lg:mt-18 lg:mr-6"
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-[#E9FFF3] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0F7C4A]">
        Advanced Hydration Technology
      </span>

      <h1 className="mt-6 max-w-[560px] text-[48px] font-black leading-[0.9] tracking-[-0.05em] lg:text-[82px]">
        Hydration.
        <span className="block text-[var(--color-secondary)]">
          Elevated.
        </span>
      </h1>

      <p className="mt-8 max-w-[470px] text-[16px] leading-7 text-slate-600 lg:mt-10 lg:text-[18px] lg:leading-8">
        Premium alkaline water solutions powered by
        magnetization for better hydration, energy and
        total wellness.
      </p>

      <HeroButtons />
    </motion.div>
  );
}