"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";

import ProductCard from "./ProductCard";
import { products } from "./products";

export default function FeaturedProducts() {
  return (
    <section className="relative overflow-hidden py-20">

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-sky-50/40 to-white" />

      <Container>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeading
            badge="Featured Products"
            title="Hydration Reimagined"
            subtitle="Premium alkaline water solutions crafted for healthier living."
            align="center"
          />
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </Container>

    </section>
  );
}