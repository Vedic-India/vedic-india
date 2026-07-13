"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";

import ProductCard from "./ProductCard";
import products from "@/constants/products";

export default function ProductsGrid() {
  return (
    <section className="bg-slate-50 py-12">
      <Container>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-6 xl:grid-cols-4"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </motion.div>

      </Container>
    </section>
  );
}