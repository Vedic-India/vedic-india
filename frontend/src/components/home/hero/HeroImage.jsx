"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const MotionImage = motion(Image);

export default function HeroImage() {
  return (
    <div className="relative flex w-full items-center justify-center pt-0 lg:ml-10 lg:pt-10">
      {/* Hero Image Container */}
      <div className="relative h-[290px] w-full bg-transparent lg:h-[570px] lg:w-[730px]">
        <Image
          src="/hero3.png"
          alt="Hero"
          fill
          priority
          className="
            object-cover object-center
            lg:object-contain lg:scale-[1.08]
          "
        />

        {/* H+ Bubble */}
        <MotionImage
          src="/h.png"
          alt="H+"
          width={130}
          height={85}
          className="
            absolute left-[55px] top-[55px] z-20
            !h-auto !w-[58px]
            lg:left-[60px] lg:top-[100px]
            lg:!w-[130px]
          "
          animate={{ y: [-5, 5, -5] }}
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
          className="
            absolute left-[100px] top-[110px] z-20
            !h-auto !w-[58px]
            lg:left-[150px] lg:top-[220px]
            lg:!w-[130px]
          "
          animate={{ y: [5, -5, 5] }}
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
          className="
            absolute right-[50px] top-[50px] z-20
            !h-auto !w-[58px]
            lg:right-[80px] lg:top-[90px]
            lg:!w-[130px]
          "
          animate={{ y: [-5, 5, -5] }}
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
          className="
            absolute right-[100px] top-[115px] z-30
            !h-auto !w-[58px]
            lg:right-[170px] lg:top-[215px]
            lg:!w-[130px]
          "
          animate={{ y: [5, -5, 5] }}
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