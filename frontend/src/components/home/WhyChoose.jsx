import {
  Droplets,
  HeartPulse,
  ShieldCheck,
  Leaf,
} from "lucide-react";

import Container from "../layout/Container";
import SectionHeading from "../layout/SectionHeading";

const features = [
  {
    icon: Droplets,
    title: "Advanced Magnetization",
    description:
      "Enhances water structure for better hydration.",
  },
  {
    icon: HeartPulse,
    title: "Health Benefits",
    description:
      "Supports digestion, energy and overall wellness.",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description:
      "Made with food-grade materials and strict quality checks.",
  },
  {
    icon: Leaf,
    title: "Eco Friendly",
    description:
      "Sustainable products designed for everyday use.",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          badge="Why Choose Us"
          title="Why Choose Vedic India?"
          subtitle="Built with science, inspired by nature."
          align="center"
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                  <Icon
                    size={26}
                    className="text-(--color-secondary)"
                  />
                </div>

                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-(--color-muted)">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}