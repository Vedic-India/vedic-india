"use client";

import { stats } from "./benefitsData";

export default function StatsBar() {
  return (
    <div className="mt-16 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`flex items-center gap-4 p-7 ${
                index !== stats.length - 1
                  ? "border-r border-slate-200"
                  : ""
              }`}
            >
              <Icon
                className="h-8 w-8 text-emerald-600"
                strokeWidth={1.8}
              />

              <div>

                <h4 className="text-3xl font-bold text-emerald-700">
                  {item.title}
                </h4>

                <p className="font-semibold text-slate-900">
                  {item.subtitle}
                </p>

                <p className="text-sm text-slate-500">
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