"use client";

import { motion } from "framer-motion";

export default function BenefitNode({
  icon: Icon,
  title,
  description,
  x,
  y,
  delay = 0,
}) {

  const isLeftSide = x < 0;
  console.log(title, x, y);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
      }}
      viewport={{ once: true }}
      className="absolute z-30"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
      }}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.06,
        }}
        className={`group flex items-center gap-4 ${
          isLeftSide ? "flex-row-reverse" : ""
        }`}
      >
        {/* Icon */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-[#0A5248]/90 shadow-[0_0_35px_rgba(34,197,94,.35)] backdrop-blur-xl transition-all duration-300 group-hover:border-emerald-300/60 group-hover:shadow-[0_0_45px_rgba(34,197,94,.6)]">
          <div className="absolute inset-0 rounded-full bg-emerald-400/10 opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />

          <Icon
            size={28}
            className="relative z-10 text-emerald-300 transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Text */}
        <div
          className={`max-w-[170px] ${
            isLeftSide ? "text-right" : "text-left"
          }`}
        >
          <h3 className="text-base font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-5 text-white/65">
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}