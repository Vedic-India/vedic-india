import { notFound } from "next/navigation";

import products from "@/constants/products";

import ProductDetails from "@/components/products/ProductDetails";
import ProductFeatures from "@/components/products/ProductFeatures";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const product = products.find((item) => item.slug === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">

      <ProductDetails product={product} />

      <ProductFeatures />


    </main>
  );
}