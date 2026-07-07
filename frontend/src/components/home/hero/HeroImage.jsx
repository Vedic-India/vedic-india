"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroImage() {
  return (
    <div className="relative flex h-[700px] w-full items-center justify-center">

      {/* Hero Image Container */}
      <div className="relative h-[720px] w-[720px] bg-transparent">

        <Image
          src="/hero3.png"
          alt="Hero"
          fill
          priority
          className="object-contain object-center scale-[1.08]"
        />

        {/* H+ Bubble */}
        <motion.img
          src="/h.png"
          alt="H+"
          className="absolute left-[80px] top-[150px] z-20 w-11"
          animate={{ y: [-8, 8, -8] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* OH Bubble */}
        <motion.img
          src="/oh.png"
          alt="OH-"
          className="absolute left-[150px] top-[240px] z-20 w-11"
          animate={{ y: [8, -8, 8] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Mg Bubble */}
        <motion.img
          src="/mg.png"
          alt="Mg2+"
          className="absolute right-[70px] top-[145px] z-20 w-11"
          animate={{ y: [-8, 8, -8] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Ca Bubble */}
        <motion.img
          src="/ca+.png"
          alt="Ca2+"
          className="absolute right-[140px] top-[260px] z-20 w-11"
          animate={{ y: [8, -8, 8] }}
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