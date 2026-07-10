"use client";

import { motion } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <>
      {/* Aurora Glow - Top Left */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#22C55E]/15 blur-[140px]"
      />

      {/* Cyan Glow */}
      <motion.div
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 25, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-180px] top-[15%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[130px]"
      />

      {/* Bottom Glow */}
      <motion.div
        animate={{
          x: [0, -25, 25, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[150px]"
      />

      {/* Floating Blur Orbs */}
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -25, 0],
            x: [0, 10, -10, 0],
            opacity: [0.25, 0.6, 0.25],
          }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-emerald-300/10 blur-3xl"
          style={{
            width: `${60 + index * 25}px`,
            height: `${60 + index * 25}px`,
            top: `${8 + index * 13}%`,
            left: `${12 + (index % 3) * 28}%`,
          }}
        />
      ))}

      {/* Small Floating Particles */}
      {[...Array(30)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute rounded-full bg-white/40"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.8, 0.15],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Gradient */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/5 to-transparent" />

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/10 to-transparent" />
    </>
  );
}