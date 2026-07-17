"use client";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

export default function ProductDetails({ product }) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] items-stretch">

        {/* Left Side */}
        <ProductGallery product={product} />

        {/* Right Side */}
        <ProductInfo product={product} />

      </div>
    </section>
  );
}