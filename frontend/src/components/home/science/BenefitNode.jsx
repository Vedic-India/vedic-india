"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BenefitNode({
  icon: Icon,
  title,
  description,
  index,
  delay = 0,
}) {
    const [screen, setScreen] = useState("desktop");

    useEffect(() => {
    const update = () => {
        if (window.innerWidth < 640) {
        setScreen("mobile");
        } else if (window.innerWidth < 1024) {
        setScreen("tablet");
        } else {
        setScreen("desktop");
        }
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
    }, []);

    const isMobile = screen === "mobile";
    const isTablet = screen === "tablet";

    const angle = index * 60 - 90;

    const radius = isMobile
      ? 150
      : isTablet
      ? 210
      : 285;

    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
      }}
      viewport={{ once: true }}
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
      className="absolute z-30"
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
          scale: 1.08,
        }}
        className="group flex items-center gap-4"
      >
        {/* Icon Circle */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/30 bg-[#0A5248]/90 shadow-[0_0_35px_rgba(34,197,94,.35)] backdrop-blur-xl transition-all duration-300 group-hover:border-emerald-300/60 group-hover:shadow-[0_0_45px_rgba(34,197,94,.6)] sm:h-14 sm:w-14 lg:h-16 lg:w-16">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-xl opacity-0 transition duration-300 group-hover:opacity-100" />

          <Icon
            size={28}
            className="relative z-10 text-emerald-300 transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Text */}
        <div className="min-w-max">
          <h3 className="text-sm font-semibold leading-none text-white sm:text-base lg:text-lg">
            {title}
          </h3>

          <p className="mt-2 text-sm text-white/65 lg:block">
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}