"use client";

import products from "@/constants/products";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ currentProduct }) {
  const relatedProducts = products.filter(
    (item) => item.id !== currentProduct.id
  );

  return (
    <section className="bg-white py-16">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-12 text-center text-4xl font-bold text-slate-900">
          You May Also Like
        </h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </div>

    </section>
  );
}