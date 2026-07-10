import Image from "next/image";
import {
  BadgeCheck,
  FlaskConical,
  Flower2,
  Leaf,
  Droplets,
  ArrowRight,
} from "lucide-react";

export default function ScienceSection() {
  return (
    <section className="overflow-hidden rounded-[32px] bg-[#042C2F] shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
      {/* ================= TOP SECTION ================= */}
      <div className="relative mx-auto h-[520px] max-w-[1650px] overflow-hidden">
        {/* Left Content */}
        <div className="relative z-10 flex h-full w-[38%] flex-col justify-center pl-14 pr-6">
          {/* Badge */}
          <div className="mb-7 flex items-center gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#43D17B"
            >
              <path d="M20.7 3.3C16.7 2.8 12.4 4 9.3 7.1C6.8 9.6 5.6 12.8 5.8 16C2.9 15.7 1 13.6 1 10.6C1 5.4 6.5 1 13.2 1C16.2 1 18.8 1.8 20.7 3.3ZM22 4.8C22 12.8 16.3 19.8 9.4 23C10.1 20.6 11.5 18.4 13.4 16.5C16.5 13.4 20.2 12.2 22 12.2V4.8Z" />
            </svg>

            <span className="text-[15px] font-semibold uppercase tracking-[0.18em] text-[#BED7C8]">
              WHY VEDIC INDIA?
            </span>
          </div>

          {/* Heading */}
          <h2 className="max-w-none whitespace-nowrap text-[60px] font-bold leading-[1.08] tracking-[-2px] text-white">
            The Science Behind
            <br />
            Better{" "}
            <span className="text-[#39D67E]">Hydration</span>
          </h2>

          {/* Description */}
          <p className="mt-9 max-w-[520px] text-[18px] leading-[1.85] text-[#D8E6E4]">
            Our 7-stage advanced technology magnetizes water and enriches it
            with essential minerals to deliver maximum hydration at cellular
            level.
          </p>

          {/* CTA */}
          <button className="mt-10 flex h-[60px] w-[225px] items-center justify-center gap-3 rounded-full bg-[#0AA55F] text-[21px] font-semibold text-white transition-all duration-300 hover:bg-[#089554]">
            Learn More
            <ArrowRight size={22} />
          </button>
        </div>

        {/* Right Image */}
        <div className="absolute right-0 top-0 h-full w-[66%]">
          <Image
            src="/images/science2.png"
            alt="Science Behind Hydration"
            fill
            priority
            className="object-contain object-right"
            style={{
              objectPosition: "right -8px",
            }}
          />
        </div>
      </div>

      {/* ================= FEATURE STRIP ================= */}
      <div className="bg-white">
        <div className="mx-auto flex h-[120px] max-w-[1650px] items-center justify-between px-12">

          <Feature
            icon={<BadgeCheck size={42} strokeWidth={1.8} />}
            title="ISO Certified"
            subtitle="Quality Assured"
          />

          <Divider />

          <Feature
            icon={<FlaskConical size={42} strokeWidth={1.8} />}
            title="Lab Tested"
            subtitle="For Purity & Safety"
          />

          <Divider />

          <Feature
            icon={<Flower2 size={42} strokeWidth={1.8} />}
            title="Made in India"
            subtitle="Proudly Indian"
          />

          <Divider />

          <Feature
            icon={<Leaf size={42} strokeWidth={1.8} />}
            title="Eco Friendly"
            subtitle="Sustainable Choice"
          />

          <Divider />

          <Feature
            icon={<Droplets size={42} strokeWidth={1.8} />}
            title="100% Natural"
            subtitle="No Chemicals"
          />

        </div>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div className="h-16 w-px bg-[#E6E8EB]" />
  );
}

function Feature({ icon, title, subtitle }) {
  return (
    <div className="flex min-w-[220px] items-center gap-5">

      <div className="text-[#16984A]">
        {icon}
      </div>

      <div>
        <h4 className="text-[17px] font-semibold text-[#111827]">
          {title}
        </h4>

        <p className="mt-1 text-[15px] text-[#667085]">
          {subtitle}
        </p>
      </div>

    </div>
  );
}