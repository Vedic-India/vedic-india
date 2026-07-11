"use client";

import { motion } from "framer-motion";

export default function BenefitCard({
  icon: Icon,
  title,
  description,
  delay,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.05,
        delay,
      }}
      whileHover={{
        y: -8,
      }}
      className="group rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-xl"
    >
      <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-blue-50 transition group-hover:scale-110">
        <Icon
          className="h-10 w-10 text-emerald-600"
          strokeWidth={1.8}
        />
      </div>

      <h3 className="mt-4 text-center text-2xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-4 text-center leading-8 text-slate-500">
        {description}
      </p>

      <div className="mx-auto mt-6 h-[3px] w-16 rounded-full bg-emerald-400 transition-all duration-300 group-hover:w-24" />
    </motion.div>
  );
}