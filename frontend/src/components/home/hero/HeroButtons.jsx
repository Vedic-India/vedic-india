import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <Link
        href="/products"
        className="group relative flex h-14 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary)] px-7 font-semibold text-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
      >
        <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />

        <span className="relative flex items-center gap-2">
          Shop Products
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </Link>

      <Link
        href="/benefits"
        className="flex h-14 items-center justify-center rounded-full border border-white/50 bg-white/70 px-7 font-semibold shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white"
      >
        Explore Benefits
      </Link>
    </div>
  );
}