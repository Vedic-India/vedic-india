"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Leaf } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: ShieldCheck,
    title: "Our Mission",
    desc: "Deliver healthier hydration through premium alkaline water.",
  },
  {
    icon: BadgeCheck,
    title: "Our Vision",
    desc: "Empower every home with intelligent hydration solutions.",
  },
  {
    icon: Leaf,
    title: "Our Values",
    desc: "Science, purity and sustainability in everything we create.",
  },
];

export default function AboutStory() {
  return (
    <section className="bg-[#F7FAFC] py-8">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="relative overflow-hidden rounded-[28px] border border-[#EDF2F7] bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
        >

          <div className="relative grid items-center gap-0 px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-14">

            {/* LEFT */}

            <div className="max-w-[430px] pl-2 pt-4">

              <h2 className="text-[46px] font-bold leading-none text-[#0F172A]">
                Our Story
              </h2>

              <div className="mt-6 space-y-4 text-[15px] leading-7 text-[#64748B]">

                <p>
                  At Vedic India, we believe hydration should do more than
                  simply quench your thirst. It should support a healthier,
                  more balanced lifestyle through scientifically designed
                  alkaline hydration solutions.
                </p>

                <p>
                  Every product we create combines advanced purification
                  technology, premium materials and thoughtful design to
                  deliver water that is pure, refreshing and trusted by
                  families every day.
                </p>

                <p>
                  Inspired by nature and driven by innovation, our mission
                  is to make premium hydration accessible without
                  compromising on quality, safety or sustainability.
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex items-end justify-end self-end py-6">

              <Image
                src="/about/water-splash4.png"
                alt="Water Splash"
                width={650}
                height={650}
                priority
                className="pointer-events-none w-[650px] select-none"
              />

            </div>

          </div>

          {/* CARDS */}

          <div className="border-t border-[#EDF2F7] px-10 pt-4 pb-6 lg:px-14">

            <div className="grid gap-4 md:grid-cols-3">

              {features.map((item, index) => {

                const Icon = item.icon;

                return (

                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.12,
                      duration: 0.45,
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="rounded-2xl border border-[#EEF3F7] bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]"
                  >

                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2FCF8]">

                      <Icon
                        className="h-5 w-5 text-[#138B66]"
                        strokeWidth={2}
                      />

                    </div>

                    <h3 className="text-base font-semibold text-[#0F172A]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#64748B]">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}