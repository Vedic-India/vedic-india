"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/Container";

import NewsletterForm from "./NewsletterForm";

export default function Newsletter() {
  return (
    <section className="relative overflow-hidden py-28">

      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-green-200/30 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-200/30 blur-[120px]" />

      <Container>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[40px] border border-white/40 bg-white/70 px-8 py-20 text-center shadow-2xl backdrop-blur-2xl md:px-20"
        >
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
            Newsletter
          </span>

          <h2 className="mt-6 text-5xl font-black">
            Stay Hydrated.
            <br />
            Stay Updated.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
            Subscribe to receive product launches, wellness tips,
            exclusive offers and health insights.
          </p>

          <NewsletterForm />
        </motion.div>

      </Container>

    </section>
  );
}