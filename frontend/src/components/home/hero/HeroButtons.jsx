import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="mt-8 flex w-full gap-3 lg:mt-10 lg:w-auto lg:gap-4">
      <Link
        href="/products"
        className="group relative flex h-14 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary)] px-4 text-sm font-semibold text-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl lg:flex-none lg:px-7 lg:text-base"
      >
        <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />

        <span className="relative flex items-center gap-1.5 whitespace-nowrap lg:gap-2">
          Shop Products
          <ArrowRight
            size={18}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </Link>

      <Link
        href="/benefits"
        className="flex h-14 min-w-0 flex-1 items-center justify-center rounded-full border border-white/50 bg-white/70 px-4 text-sm font-semibold shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white lg:flex-none lg:px-7 lg:text-base"
      >
        <span className="whitespace-nowrap">
          Explore Benefits
        </span>
      </Link>
    </div>
  );
}