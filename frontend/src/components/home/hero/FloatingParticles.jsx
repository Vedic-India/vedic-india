"use client";

import { motion } from "framer-motion";

const particles = [
  {
    size: 12,
    top: "12%",
    left: "10%",
    delay: 0,
  },
  {
    size: 16,
    top: "22%",
    right: "12%",
    delay: 1,
  },
  {
    size: 18,
    bottom: "20%",
    left: "15%",
    delay: 2,
  },
  {
    size: 14,
    bottom: "12%",
    right: "18%",
    delay: 3,
  },
  {
    size: 10,
    top: "55%",
    left: "45%",
    delay: 4,
  },
];

export default function FloatingParticles() {
  return (
    <>
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 4,
            delay: particle.delay,
            repeat: Infinity,
          }}
          className="absolute rounded-full bg-white/60 backdrop-blur-xl"
          style={{
            width: particle.size,
            height: particle.size,
            top: particle.top,
            left: particle.left,
            right: particle.right,
            bottom: particle.bottom,
          }}
        />
      ))}
    </>
  );
}