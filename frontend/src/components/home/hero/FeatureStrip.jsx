import {
  Droplets,
  FlaskConical,
  Leaf,
  Zap,
  ShieldCheck,
} from "lucide-react";

const items = [
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

export default function FeatureStrip() {
  return (
    <section className="m-0 w-full border-y border-[#E8EEF5] bg-white">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 lg:grid-cols-5">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`${
                  index === 0
                    ? "hidden lg:flex"
                    : "flex"
                } items-center justify-center gap-5 px-8 py-8 ${
                  index !== items.length - 1
                    ? "border-r border-[#E8EEF5]"
                    : ""
                }`}
              >
                <Icon
                  size={32}
                  strokeWidth={1.8}
                  className="shrink-0 text-[var(--color-secondary)]"
                />

                <div className="flex flex-col">
                  <h3 className="text-[15px] font-semibold leading-none text-[#111827]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[13px] leading-[1.35] text-[#6B7280]">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}