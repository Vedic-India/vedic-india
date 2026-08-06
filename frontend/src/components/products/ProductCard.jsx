"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Pencil, Power } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToggleProductStatus } from "@/hooks/mutations/useToggleProductStatus";
import {
  PRODUCT_PLACEHOLDER_IMAGE,
  getProductImageUrls,
} from "@/utils/product";
import { getProductVolumeBySlug } from "@/components/home/products/products";

const getIsProductActive = (product) => {
  if (typeof product?.isActive === "boolean") {
    return product.isActive;
  }

  if (typeof product?.active === "boolean") {
    return product.active;
  }

  if (typeof product?.status === "string") {
    return product.status.toLowerCase() === "active";
  }

  return true;
};

export default function ProductCard({ product, onEdit }) {
  const image = getProductImageUrls(product)[0] || PRODUCT_PLACEHOLDER_IMAGE;
  const productSlug = product?.slug || product?._id || "";
  const productPrice = Number(product?.price ?? 0);
  const productStock = Number(product?.stock ?? 0);
  const productVolume = getProductVolumeBySlug(productSlug);

  const badge =
    productStock === 0
      ? "Out of Stock"
      : productStock <= 10
      ? "Low Stock"
      : null;

  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isActive = getIsProductActive(product);

  const toggleProductStatusMutation = useToggleProductStatus();

  const handleToggleStatus = (event) => {
    event.preventDefault();
    event.stopPropagation();

    toggleProductStatusMutation.mutate(productSlug);
  };

  return (
    <Link href={`/products/${productSlug}`}>
      <motion.div
        whileHover={{
          y: -10,
          scale: 1.02,
        }}
        transition={{ duration: 0.35 }}
        className="group mx-auto w-full max-w-75 cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-500 hover:shadow-[0_35px_60px_rgba(16,24,40,0.16)]"
      >
        {/* Image */}

        <div className="relative overflow-hidden bg-linear-to-b from-sky-50 via-white to-emerald-50 px-2 pt-2 pb-1">
          {isAdmin && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={
                isActive ? `Deactivate ${product.name}` : `Activate ${product.name}`
              }
              title={
                isActive ? "Deactivate product" : "Activate product"
              }
              disabled={toggleProductStatusMutation.isPending}
              className="absolute top-4 right-16 z-10 h-9 w-9 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              onClick={handleToggleStatus}
            >
              <Power className="h-4 w-4" />
            </Button>
          )}

          {isAdmin && onEdit && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Edit ${product.name}`}
              className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onEdit(product);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}

          {badge && (
            <span
              className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-sm ${
                productStock === 0
                  ? "bg-red-600"
                  : "bg-amber-500"
              }`}
            >
              {badge}
            </span>
          )}

          <div className="relative mx-auto h-56 w-56">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain transition duration-500 group-hover:scale-110"
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
            />
          </div>
        </div>

        {/* Content */}

        <div className="px-5 pt-4 pb-4">
          <h3 className="text-xl font-bold leading-tight text-slate-900">
            {product.name}
          </h3>

          {productVolume && (
            <p className="mt-1 text-sm text-slate-500">
              {productVolume}
            </p>
          )}

          <p
            className={`mt-1 text-sm ${
              productStock > 0 && productStock <= 10
                ? "font-semibold text-red-600"
                : "text-slate-500"
            }`}
          >
            {productStock > 0
              ? productStock <= 10
                ? `Only ${productStock} items remaining`
                : null
              : "Currently unavailable"}
          </p>

          <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-slate-500">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-700">
              ₹{productPrice.toLocaleString("en-IN")}
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-emerald-600">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}