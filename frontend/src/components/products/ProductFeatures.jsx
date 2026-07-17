import {
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% Safe Checkout",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "7 Day Return Policy",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "Across India",
  },
  {
    icon: BadgeCheck,
    title: "Premium Quality",
    subtitle: "Trusted Products",
  },
];

export default function ProductFeatures() {
  return (
    <section className="bg-white py-10">

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-6 md:grid-cols-4">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">

                <Icon size={28} />

              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {feature.subtitle}
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
}