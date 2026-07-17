"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ product }) {
  // Until backend provides multiple images,
  // use the same image four times.
  const images = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex items-start gap-5">

      {/* Thumbnails */}

      <div className="flex flex-col gap-4 pt-2">

        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`group relative h-[84px] w-[84px] overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              selectedImage === image
                ? "border-emerald-600 ring-4 ring-emerald-100 shadow-lg scale-105"
                : "border-slate-200 hover:border-emerald-400"
            }`}
          >
            <Image
              src={image}
              alt={`${product.name} ${index + 1}`}
              fill
              className="object-cover p-2 transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}

      </div>

      {/* Main Image */}

      <div className="flex h-[560px] flex-1 items-center justify-center rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">

        <div className="relative h-[430px] w-[360px]">

          <Image
            key={selectedImage}
            src={selectedImage}
            alt={product.name}
            fill
            priority
            className="object-contain transition-all duration-300"
          />

        </div>

      </div>

    </div>
  );
}