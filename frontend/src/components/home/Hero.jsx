"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

import Container from "../layout/Container";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#f8fcff] to-white">
      <Container>
        <div className="grid min-h-[700px] items-center gap-10 py-16 lg:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
              Advanced Hydration Technology
            </div>

            <h1 className="mt-6 text-6xl font-extrabold leading-tight">
              Hydration.
              <br />
              <span className="text-(--color-secondary)">
                Elevated.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-(--color-muted)">
              Premium alkaline water solutions powered by magnetization for
              better hydration, energy and total wellness.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-full bg-(--color-primary) px-7 py-4 font-semibold text-white transition hover:opacity-90">
                Shop Products
                <ArrowRight size={18} />
              </button>

              <button className="rounded-full border border-(--color-border) bg-white px-7 py-4 font-semibold shadow-sm">
                Explore Technology
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <Image
                  src="/avatars/avatar1.jpg"
                  alt=""
                  width={42}
                  height={42}
                  className="rounded-full border-2 border-white"
                />
                <Image
                  src="/avatars/avatar2.jpg"
                  alt=""
                  width={42}
                  height={42}
                  className="rounded-full border-2 border-white"
                />
                <Image
                  src="/avatars/avatar3.jpg"
                  alt=""
                  width={42}
                  height={42}
                  className="rounded-full border-2 border-white"
                />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users size={18} />
                Trusted by 20,000+ customers
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            <Image
              src="/hero.png"
              alt="Hero Bottle"
              width={900}
              height={900}
              priority
            />
          </motion.div>

        </div>
      </Container>
    </section>
  );
}