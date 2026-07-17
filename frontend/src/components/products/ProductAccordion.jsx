"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ProductAccordion({ product }) {
  const [open, setOpen] = useState("description");

  const sections = [
    {
      id: "description",
      title: "Description",
      content: product.description,
    },
    {
      id: "benefits",
      title: "Benefits",
      content: (
        <ul className="list-disc space-y-2 pl-5">
          {product.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      ),
    },
    {
      id: "specifications",
      title: "Specifications",
      content: (
        <div className="space-y-2">
          <p><strong>Product:</strong> {product.name}</p>
          <p><strong>Size:</strong> {product.size}</p>
          <p><strong>Category:</strong> Premium Alkaline Water</p>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-slate-50 py-16">

      <div className="mx-auto max-w-5xl px-6">

        <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">
          Product Details
        </h2>

        <div className="space-y-5">

          {sections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >

              <button
                onClick={() =>
                  setOpen(open === section.id ? "" : section.id)
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-lg font-semibold">
                  {section.title}
                </span>

                <ChevronDown
                  className={`transition duration-300 ${
                    open === section.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === section.id && (
                <div className="border-t border-slate-200 px-6 py-5 leading-8 text-slate-600">
                  {section.content}
                </div>
              )}

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}