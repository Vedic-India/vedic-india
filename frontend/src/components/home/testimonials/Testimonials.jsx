"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";

import { testimonials } from "./testimonials";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
  return (
    <section className="py-28">
      <Container>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeading
            badge="Testimonials"
            title="Loved By Our Customers"
            subtitle="See what our customers have to say about Vedic India."
            align="center"
          />
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>

      </Container>
    </section>
  );
}