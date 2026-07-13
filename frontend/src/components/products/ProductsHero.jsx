"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/layout/Container";

export default function ProductsHero() {
  return (
    <section className="relative border-b border-slate-200 bg-white">

      <div className="relative w-full">

        <Image
          src="/images/products_banner.png"
          alt="Products Banner"
          width={1920}
          height={350}
          priority
          className="h-[110px] w-full object-cover object-right md:h-[140px]"
        />

        <Container className="absolute inset-0 z-10 flex items-center">

  <motion.div
    initial={{ opacity: 0, x: -25 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="ml-6 md:ml-10 lg:ml-14"
  >
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Our Products
            </h1>

            <p className="mt-1 text-xs leading-5 text-slate-600 md:text-xs">
              Premium alkaline water solutions
              <br />
              for healthier everyday living.
            </p>
          </motion.div>

        </Container>

      </div>

    </section>
  );
}