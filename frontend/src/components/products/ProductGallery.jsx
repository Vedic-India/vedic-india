"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import {
  getProductImageUrls,
  PRODUCT_PLACEHOLDER_IMAGE,
} from "@/utils/product";

import { getProductVolumeBySlug } from "@/components/home/products/products";

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
    <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:gap-5">

      {/* Thumbnails */}
      <div className="order-1 flex min-w-0 max-w-full gap-3 overflow-x-auto pb-1 md:order-none md:flex-col md:gap-4 md:overflow-visible md:pb-0">

        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:h-21 md:w-21 ${
              safeSelectedImage === image
                ? "scale-105 border-emerald-600 shadow-lg ring-4 ring-emerald-100"
                : "border-slate-200 hover:border-emerald-400"
            }`}
          >
            <Image
              src={image}
              alt={`${product.name} ${index + 1}`}
              fill
              sizes="84px"
              className="object-cover p-2 transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}

      </div>

      {/* Main Image */}
      <div className="flex min-w-0 w-full flex-1 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-sky-50 via-white to-emerald-50 p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-6 md:h-140">

        <div className="relative aspect-[4/5] w-full max-w-90 md:h-107.5 md:w-90 md:aspect-auto">

          <Image
            key={safeSelectedImage}
            src={safeSelectedImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 90vw, 360px"
            className="object-contain transition-all duration-300"
          />

        </div>

      </div>

    </div>
  );
}