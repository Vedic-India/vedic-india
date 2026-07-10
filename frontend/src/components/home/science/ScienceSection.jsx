"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BenefitNode from "./BenefitNode";
import AnimatedRing from "./AnimatedRing";
import { benefits, scienceContent } from "./data";
import BackgroundGlow from "./BackgroundGlow";


export default function ScienceSection() {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#032F2C] via-[#044640] to-[#055A51] px-6 py-16 sm:px-8 lg:px-16 lg:py-24 text-white">

      {/* Background Glow */}
      <BackgroundGlow />

      <div className="grid items-center gap-12 lg:grid-cols-2">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold tracking-wide text-emerald-300">
            {scienceContent.badge}
          </div>

          <h2 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {scienceContent.heading.first}
            <span className="block bg-gradient-to-r from-[#7EF3B8] to-[#35C57B] bg-clip-text text-transparent">
              {scienceContent.heading.highlight}
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-white/70 sm:text-lg">
            {scienceContent.description}
          </p>

          <button className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_rgba(16,185,129,.35)]">
            {scienceContent.buttonText}
            <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, scale: .9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="relative mx-auto mt-12 h-[380px] w-[380px] sm:h-[520px] sm:w-[520px] lg:mt-0 lg:h-[650px] lg:w-[650px]"
        >

          {/* Circle */}

          <AnimatedRing />

          {/* Center Glow */}

          <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[80px]" />

          {/* Woman */}

          <div className="absolute left-1/2 top-1/2 z-20 h-[280px] w-[200px] -translate-x-1/2 -translate-y-1/2 sm:h-[360px] sm:w-[250px] lg:h-[470px] lg:w-[330px]">
            <Image
              src="/images/woman.png"
              alt=""
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Nodes */}

          {benefits.map((item, index) => (
                <BenefitNode
                    key={item.id}
                    {...item}
                    index={index}
                    delay={index * 0.1}
                />
           ))}

        </motion.div>

      </div>
    </section>
  );
}