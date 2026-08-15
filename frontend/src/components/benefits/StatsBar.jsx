"use client";

import { stats } from "./benefitsData";

export default function StatsBar() {
  return (
    <div className="mt-12 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm sm:mt-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((item, index) => {
          const Icon = item.icon;

          const isLast = index === stats.length - 1;

          return (
            <div
              key={item.title}
              className={`
                flex min-w-0 items-start gap-3 p-5 sm:gap-4 sm:p-7

                ${isLast ? "col-span-2 md:col-span-1" : ""}

                ${
                  index === 0
                    ? "border-b border-slate-200 md:border-b-0 md:border-r"
                    : ""
                }

                ${
                  index === 1
                    ? "border-b border-slate-200 md:border-b-0 md:border-r"
                    : ""
                }

                ${
                  index === 2
                    ? "border-b border-slate-200 md:border-b-0 md:border-r"
                    : ""
                }

                ${
                  index === 3
                    ? "border-b border-slate-200 md:border-b-0 md:border-r"
                    : ""
                }

                ${
                  isLast
                    ? "border-t border-slate-200 md:border-t-0 md:border-r-0"
                    : ""
                }
              `}
            >
              {/* Icon */}
              <Icon
                className="mt-1 h-6 w-6 shrink-0 text-emerald-600 sm:h-8 sm:w-8"
                strokeWidth={1.8}
              />

              {/* Content */}
              <div className="min-w-0">
                <h4 className="whitespace-nowrap text-2xl font-bold leading-tight text-emerald-700 sm:text-3xl">
                  {item.title}
                </h4>

                <p className="mt-1 text-sm font-semibold leading-5 text-slate-900 sm:text-base">
                  {item.subtitle}
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}