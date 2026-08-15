"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const MotionImage = motion(Image);

export default function HeroImage() {
  return (
    <div className="relative flex w-full items-center justify-center pt-10 ml-10">

      {/* Hero Image Container */}
      <div className="relative h-[570px] w-[730px] bg-transparent">

        {/* Main Hero Image */}
        <Image
          src="/hero3.png"
          alt="Hero"
          fill
          priority
          className="object-contain object-center scale-[1.08]"
        />

        {/* H+ Bubble */}
        <MotionImage
          src="/h.png"
          alt="H+"
          width={130}
          height={85}
          className="absolute left-[60px] top-[100px] z-20"
          animate={{ y: [-8, 8, -8] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* OH- Bubble */}
        <MotionImage
          src="/oh.png"
          alt="OH-"
          width={130}
          height={85}
          className="absolute left-[150px] top-[220px] z-20"
          animate={{ y: [8, -8, 8] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Mg+ Bubble */}
        <MotionImage
          src="/mg+.png"
          alt="Mg+"
          width={130}
          height={85}
          className="absolute right-[80px] top-[90px] z-20"
          animate={{ y: [-8, 8, -8] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Ca2+ Bubble */}
        <MotionImage
          src="/ca+.png"
          alt="Ca2+"
          width={130}
          height={85}
          className="absolute right-[170px] top-[230px] z-20"
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