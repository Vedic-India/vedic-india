"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";

import BenefitCard from "./BenefitCard";
import { benefits } from "./benefits";

export default function BenefitsSection() {
  return (
    <section className="bg-[#f9fbff] py-28">
      <Container>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeading
            badge="Why Choose Us"
            title="Healthy Water. Better Living."
            subtitle="Everything you need for a healthier hydration experience."
            align="center"
          />
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <BenefitCard
              key={benefit.title}
              benefit={benefit}
            />
          ))}
        </div>

      </Container>
    </section>
  );
}