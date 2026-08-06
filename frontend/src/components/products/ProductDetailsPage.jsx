"use client";

import { notFound } from "next/navigation";

import ProductDetails from "./ProductDetails";
import ProductFeatures from "./ProductFeatures";

import { useProduct } from "@/hooks/queries/useProduct";

export default function ProductDetailsPage({ slug }) {
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProduct(slug);

  const isNotFound = error?.response?.status === 404;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-22">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="h-150 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (isNotFound) {
    notFound();
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50 pt-22">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Unable to load product
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              {error?.response?.data?.message ||
                "Please try again in a moment."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-22">
      <ProductDetails product={product} />

      <ProductFeatures />
    </main>
  );
}