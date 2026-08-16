import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FlaskConical,
  Flower2,
  Leaf,
  Droplets,
} from "lucide-react";

export default function ScienceSection() {
  return (
    <section className="mb-20 overflow-hidden rounded-[32px] bg-[#042C2F] shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
      {/* ================= TOP SECTION ================= */}
      <div
        className="
          relative mx-auto overflow-hidden
          max-w-[1650px]

          lg:flex
          lg:min-h-[500px]

          xl:relative
          xl:block
          xl:h-[520px]
        "
      >
        {/* ================= LEFT CONTENT ================= */}
        <div
          className="
            relative z-10
            flex flex-col justify-center

            px-7
            pt-12
            pb-2

            sm:px-10
            sm:pt-14
            sm:pb-3

            lg:w-1/2
            lg:px-8
            lg:py-10
            lg:pr-6

            xl:absolute
            xl:left-0
            xl:top-0
            xl:h-full
            xl:w-[38%]
            xl:px-14
            xl:py-0
            xl:pr-6
          "
        >
          {/* Badge */}
          <div className="mb-6 flex items-center gap-3 xl:mb-7">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#43D17B"
              className="shrink-0"
            >
              <path d="M20.7 3.3C16.7 2.8 12.4 4 9.3 7.1C6.8 9.6 5.6 12.8 5.8 16C2.9 15.7 1 13.6 1 10.6C1 5.4 6.5 1 13.2 1C16.2 1 18.8 1.8 20.7 3.3ZM22 4.8C22 12.8 16.3 19.8 9.4 23C10.1 20.6 11.5 18.4 13.4 16.5C16.5 13.4 20.2 12.2 22 12.2V4.8Z" />
            </svg>

            <span
              className="
                text-[13px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#BED7C8]

                sm:text-[14px]

                xl:text-[15px]
                xl:tracking-[0.18em]
              "
            >
              WHY VEDIC INDIA?
            </span>
          </div>

          {/* Heading */}
          <h2
            className="
              max-w-[620px]
              text-[40px]
              font-bold
              leading-[1.08]
              tracking-[-1.5px]
              text-white

              sm:text-[46px]

              lg:max-w-[470px]
              lg:text-[42px]
              lg:tracking-[-1.5px]

              xl:max-w-none
              xl:whitespace-nowrap
              xl:text-[60px]
              xl:tracking-[-2px]
            "
          >
            The Science Behind
            <br />
            Better{" "}
            <span className="text-[#39D67E]">Hydration</span>
          </h2>

          {/* Description */}
          <p
            className="
              mt-7
              max-w-[520px]
              text-[16px]
              leading-[1.7]
              text-[#D8E6E4]

              sm:text-[17px]

              lg:mt-6
              lg:max-w-[440px]
              lg:text-[16px]
              lg:leading-[1.7]

              xl:mt-9
              xl:max-w-[520px]
              xl:text-[18px]
              xl:leading-[1.85]
            "
          >
            Our 7-stage advanced technology magnetizes water and enriches it
            with essential minerals to deliver maximum hydration at cellular
            level.
          </p>

          {/* CTA */}
          <Link
            href="/benefits"
            className="
              mt-8
              flex h-[52px] w-[190px]
              items-center justify-center gap-3
              rounded-full
              bg-[#0AA55F]
              text-[17px]
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-[#089554]

              lg:mt-7
              lg:h-[54px]
              lg:w-[200px]

              xl:mt-10
              xl:h-[60px]
              xl:w-[225px]
              xl:text-[21px]
            "
          >
            Learn More
            <ArrowRight size={22} />
          </Link>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div
          className="
            relative
            h-[230px]
            w-full

            sm:h-[300px]

            lg:h-[500px]
            lg:w-1/2

            xl:absolute
            xl:right-0
            xl:top-0
            xl:h-full
            xl:w-[66%]
          "
        >
          <Image
            src="/images/science2.png"
            alt="Science Behind Hydration"
            fill
            priority
            sizes="
              (max-width: 1023px) 100vw,
              (max-width: 1279px) 50vw,
              66vw
            "
            className="
              object-contain
              object-center

              lg:object-contain
              lg:object-center

              xl:object-right
            "
          />
        </div>
      </div>

      {/* ================= FEATURE STRIP ================= */}
      <div className="bg-white">
        <div
          className="
            mx-auto
            grid
            grid-cols-2
            gap-x-5
            gap-y-6
            px-5
            py-6

            sm:px-8
            sm:py-7

            lg:flex
            lg:h-[120px]
            lg:items-center
            lg:justify-between
            lg:gap-0
            lg:px-10
            lg:py-0

            xl:px-12
          "
        >
          {/* ISO Certified */}
          <Feature
            icon={<BadgeCheck size={42} strokeWidth={1.8} />}
            title="ISO Certified"
            subtitle="Quality Assured"
          />

          <Divider />

          {/* Lab Tested */}
          <Feature
            icon={<FlaskConical size={42} strokeWidth={1.8} />}
            title="Lab Tested"
            subtitle="For Purity & Safety"
          />

          <Divider />

          {/* Made in India */}
          <Feature
            icon={<Flower2 size={42} strokeWidth={1.8} />}
            title="Made in India"
            subtitle="Proudly Indian"
          />

          <Divider />

          {/* Eco Friendly - Desktop only */}
          <div className="hidden lg:flex">
            <Feature
              icon={<Leaf size={42} strokeWidth={1.8} />}
              title="Eco Friendly"
              subtitle="Sustainable Choice"
            />
          </div>

          <Divider />

          {/* 100% Natural */}
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

/* ================= FEATURE ================= */

function Feature({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 text-[#0AA55F]">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-[#17201D] sm:text-[16px]">
          {title}
        </h3>

        <p className="mt-1 text-[12px] text-[#6B7280] sm:text-[13px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ================= DIVIDER ================= */

function Divider() {
  return (
    <div className="hidden h-12 w-px bg-[#E5E7EB] lg:block" />
  );
}