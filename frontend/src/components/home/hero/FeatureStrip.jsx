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
    <div className="-mt-2 rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_15px_40px_rgba(15,23,42,.08)]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-3 border-r last:border-r-0 p-5"
            >
              <Icon
                className="text-sky-500"
                size={26}
              />

              <div>
                <p className="text-sm font-semibold">
                  {item.title}
                </p>

                <p className="text-xs text-gray-500">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}