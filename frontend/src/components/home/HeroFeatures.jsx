import {
  Droplets,
  FlaskConical,
  Leaf,
  Zap,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Droplets,
    title: "Magnetized Water",
    subtitle: "Better absorption",
  },
  {
    icon: FlaskConical,
    title: "Balanced pH",
    subtitle: "Perfectly alkaline",
  },
  {
    icon: Leaf,
    title: "Essential Minerals",
    subtitle: "Naturally enriched",
  },
  {
    icon: Zap,
    title: "Improves Energy",
    subtitle: "Feel the difference",
  },
  {
    icon: ShieldCheck,
    title: "Detoxifies Body",
    subtitle: "Supports wellness",
  },
];

export default function HeroFeatures() {
  return (
    <section className="border-y bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-8 md:grid-cols-3 lg:grid-cols-5">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="rounded-full bg-green-50 p-3">
                <Icon
                  className="text-[var(--color-secondary)]"
                  size={22}
                />
              </div>

              <div>
                <h4 className="font-semibold">
                  {feature.title}
                </h4>

                <p className="text-sm text-[var(--color-muted)]">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}