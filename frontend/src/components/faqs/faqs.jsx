"use client";

import { useState } from "react";
import { ChevronDown, Mail, Phone, Truck } from "lucide-react";
import { faqs } from "./faqsData";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#F8FBFF]">
      {/* Background Blurs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-20 top-0 h-[420px] w-[420px] rounded-full bg-[#D8ECFF] blur-[140px]" />
        <div className="absolute right-0 top-20 h-[350px] w-[350px] rounded-full bg-[#E6F8F1] blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#F1F9FF] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0F2343] md:text-6xl">
            Frequently Asked
            <span className="block bg-gradient-to-r from-[#17A768] to-[#0D8B57] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
        </div>

        {/* FAQ Card */}
        <div className="mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-[30px] border border-[#E8EEF6] bg-white shadow-[0_15px_50px_rgba(15,35,67,0.06)]">
            {faqs.map((faq, index) => {
                const open = openIndex === index;

                return (
                <div
                    key={faq.question}
                    className="border-b border-[#EEF3F8] last:border-none"
                >
                    <button
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-300 hover:bg-[#F7FBFF]"
                    >
                    <h3 className="text-lg font-semibold text-[#13284A]">
                        {faq.question}
                    </h3>

                    <ChevronDown
                        className={`h-5 w-5 text-[#7E8CA0] transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                        }`}
                    />
                    </button>

                    <div
                    className={`grid transition-all duration-300 ease-in-out ${
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                    >
                    <div className="overflow-hidden">
                        <div className="px-8 pb-6 text-[16px] leading-8 text-[#66768C]">
                        {faq.answer}
                        </div>
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        </div>

        {/* Support Strip */}
        <div className="mt-12 overflow-hidden rounded-[30px] border border-[#E8EEF6] bg-white shadow-[0_12px_40px_rgba(15,35,67,0.06)]">
          <div className="grid md:grid-cols-4">
            {/* Left */}
            <div className="flex flex-col justify-center p-10">
              <h3 className="text-3xl font-bold text-[#0F2343]">
                Can't find what you're looking for?
              </h3>

              <p className="mt-3 leading-7 text-[#66768C]">
                Our support team is here to help you.
              </p>
            </div>

            {/* Fast Support */}
            <div className="flex flex-col items-center justify-center border-l border-[#EEF3F8] p-10 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF8F2]">
                <Truck className="h-7 w-7 text-[#0E8A55]" />
              </div>

              <h4 className="font-semibold text-[#0F2343]">
                Fast Support
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#66768C]">
                We reply within
                <br />
                24 hours
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center justify-center border-l border-[#EEF3F8] p-10 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF8F2]">
                <Mail className="h-7 w-7 text-[#0E8A55]" />
              </div>

              <h4 className="font-semibold text-[#0F2343]">
                Email Us
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#66768C]">
                carevedicindia@gmail.com
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center justify-center border-l border-[#EEF3F8] p-10 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF8F2]">
                <Phone className="h-7 w-7 text-[#0E8A55]" />
              </div>

              <h4 className="font-semibold text-[#0F2343]">
                Call Us
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#66768C]">
                +91 12345 67890
                <br />
                (10 AM – 6 PM)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}