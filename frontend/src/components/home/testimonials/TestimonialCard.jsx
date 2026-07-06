"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="rounded-[32px] border border-white/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          width={60}
          height={60}
          className="rounded-full"
        />

        <div>
          <h3 className="font-bold">
            {testimonial.name}
          </h3>

          <p className="text-sm text-gray-500">
            {testimonial.location}
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            fill="#facc15"
            stroke="#facc15"
          />
        ))}
      </div>

      <p className="mt-5 leading-8 text-gray-600">
        "{testimonial.review}"
      </p>
    </motion.div>
  );
}