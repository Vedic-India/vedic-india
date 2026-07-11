"use client";

import BenefitCard from "./BenefitCard";
import SectionHeader from "./SectionHeader";
import StatsBar from "./StatsBar";
import { benefits } from "./benefitsData";

export default function BenefitsSection() {
  return (
    <section className="relative overflow-hidden bg-[#FCFDFD] py-28">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#dff4ff_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <SectionHeader />

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {benefits.map((item, index) => (
            <BenefitCard
              key={item.title}
              {...item}
              delay={index * 0.08}
            />
          ))}

        </div>

        <StatsBar />

      </div>

    </section>
  );
}