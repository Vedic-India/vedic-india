"use client";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

export default function ProductDetails({ product }) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto grid min-w-0 max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        {/* Left Side */}
        <ProductGallery product={product} />

        {/* Right Side */}
        <ProductInfo product={product} />
      </div>
    </section>
  );
}