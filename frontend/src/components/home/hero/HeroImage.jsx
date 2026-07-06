"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroImage() {
  return (
    <div className="relative flex h-[620px] w-full items-center justify-center">

      {/* Soft Blue Glow */}
      <div className="absolute h-[540px] w-[540px] rounded-full bg-[#DCEEFF]/70 blur-[90px]" />

      {/* Hero Image Container */}
      <div className="relative h-[650px] w-[650px]">

        <Image
          src="/hero3.png"
          alt="Hero"
          fill
          priority
          className="object-contain object-bottom"
        />

        {/* OH Bubble */}
        <motion.img
          src="/oh.png"
          alt="OH"
          className="absolute left-[90px] top-[120px] z-20 w-10"
          animate={{ y: [-8, 8, -8] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Mg Bubble */}
        <motion.img
          src="/mg.png"
          alt="Mg"
          className="absolute right-[30px] top-[80px] z-20 w-10"
          animate={{ y: [8, -8, 8] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Ca Bubble */}
        <motion.img
          src="/ca+.png"
          alt="Ca"
          className="absolute right-[85px] top-[210px] z-20 w-10"
          animate={{ y: [-8, 8, -8] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

      </div>

    </div>
  );
}