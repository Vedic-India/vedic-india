"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import {
  getProductImageUrls,
  PRODUCT_PLACEHOLDER_IMAGE,
} from "@/utils/product";

export default function ProductGallery({ product }) {
  const images = useMemo(() => {
    const imageUrls = getProductImageUrls(product);

    return imageUrls.length > 0
      ? imageUrls
      : [PRODUCT_PLACEHOLDER_IMAGE];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(() => images[0]);

  const safeSelectedImage = images.includes(selectedImage)
    ? selectedImage
    : images[0];

  return (
    <div className="flex items-start gap-5">

      {/* Thumbnails */}

      <div className="flex flex-col gap-4 pt-2">

        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`group relative h-21 w-21 overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              safeSelectedImage === image
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

      <div className="flex h-140 flex-1 items-center justify-center rounded-3xl border border-slate-200 bg-linear-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">

        <div className="relative h-107.5 w-90">

          <Image
            key={safeSelectedImage}
            src={safeSelectedImage}
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