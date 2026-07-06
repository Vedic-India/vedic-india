"use client";

import { motion } from "framer-motion";

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
}) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: 60,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.6,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}