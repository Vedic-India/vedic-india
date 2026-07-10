"use client";

import { motion } from "framer-motion";

export default function AnimatedRing() {
  return (
    <>
      {/* Outer Ring */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <defs>
          <linearGradient id="outerRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" stopOpacity=".9" />
            <stop offset="100%" stopColor="#10B981" stopOpacity=".2" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke="url(#outerRing)"
          strokeWidth=".35"
          strokeDasharray="4 2"
        />
      </motion.svg>

      {/* Middle Ring */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        animate={{ rotate: -360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <defs>
          <linearGradient id="middleRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" stopOpacity=".8" />
            <stop offset="100%" stopColor="#A7F3D0" stopOpacity=".15" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="url(#middleRing)"
          strokeWidth=".3"
          strokeDasharray="2 3"
        />
      </motion.svg>

      {/* Inner Ring */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <defs>
          <linearGradient id="innerRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity=".9" />
            <stop offset="100%" stopColor="#10B981" stopOpacity=".25" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="url(#innerRing)"
          strokeWidth=".25"
          strokeDasharray="1.5 2.5"
        />
      </motion.svg>

      {/* Pulsing Glow */}
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[80px]"
      />

      {/* Orbiting Dots */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0"
      >
        <div className="absolute left-1/2 top-[5%] h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_15px_#6EE7B7]" />

        <div className="absolute right-[8%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_#67E8F9]" />

        <div className="absolute bottom-[6%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_15px_#6EE7B7]" />

        <div className="absolute left-[8%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_#67E8F9]" />
      </motion.div>

      {/* Small Floating Particles */}
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-emerald-200"
          style={{
            top: `${15 + index * 9}%`,
            left: `${20 + (index % 4) * 18}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2 + index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}