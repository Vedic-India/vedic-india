import Image from "next/image";
import { Star } from "lucide-react";

export default function HeroStats() {
  return (
    <div className="mt-10 flex items-center gap-5">

      <div className="flex -space-x-3">
        <Image
          src="/avatar-placeholder.png"
          alt=""
          width={50}
          height={50}
          className="rounded-[30px] border-2 border-white"
        />

        <Image
          src="/avatar-placeholder.png"
          alt=""
          width={50}
          height={50}
          className="rounded-[30px] border-2 border-white"
        />

        <Image
          src="/avatar-placeholder.png"
          alt=""
          width={50}
          height={50}
          className="rounded-[30px] border-2 border-white"
        />
      </div>

      <div>
        {/* <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={15}
              fill="#facc15"
              stroke="#facc15"
            />
          ))}
        </div> */}

        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Trusted by 20,000+ Customers
        </p>
      </div>

    </div>
  );
}