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
  const image =
    getProductImageUrls(product)[0] || PRODUCT_PLACEHOLDER_IMAGE;

  const productSlug = product?.slug || product?._id || "";
  const productPrice = Number(product?.price ?? 0);
  const productStock = Number(product?.stock ?? 0);
  const productVolume = getProductVolumeBySlug(productSlug);

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
        whileTap={{
          scale: 0.98,
        }}
        transition={{ duration: 0.35 }}
        className="
          group
          mx-auto
          w-full
          min-w-0
          cursor-pointer
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-md
          transition-all
          duration-500
          hover:shadow-[0_35px_60px_rgba(16,24,40,0.16)]
          sm:rounded-3xl
        "
      >
        {/* Image */}

        <div className="relative overflow-hidden bg-linear-to-b from-sky-50 via-white to-emerald-50 px-2 pt-2 pb-1">
          {/* Admin: Toggle Active Status */}

          {isAdmin && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={
                isActive
                  ? `Deactivate ${product.name}`
                  : `Activate ${product.name}`
              }
              title={
                isActive
                  ? "Deactivate product"
                  : "Activate product"
              }
              disabled={toggleProductStatusMutation.isPending}
              className="
                absolute
                top-3
                right-12
                z-10
                h-8
                w-8
                rounded-full
                border-slate-200
                bg-white
                text-slate-700
                shadow-sm
                hover:bg-slate-50
                sm:top-4
                sm:right-16
                sm:h-9
                sm:w-9
              "
              onClick={handleToggleStatus}
            >
              <Power className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}

          {/* Admin: Edit */}

          {isAdmin && onEdit && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Edit ${product.name}`}
              title="Edit product"
              className="
                absolute
                top-3
                right-3
                z-10
                h-8
                w-8
                rounded-full
                border-slate-200
                bg-white
                text-slate-700
                shadow-sm
                hover:bg-slate-50
                sm:top-4
                sm:right-4
                sm:h-9
                sm:w-9
              "
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onEdit(product);
              }}
            >
              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}

          {/* Product Image */}

          <div className="relative mx-auto aspect-square w-[96%] max-w-64 sm:w-[90%] sm:max-w-56">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain transition duration-500 group-hover:scale-110"
              sizes="
                (max-width: 640px) 46vw,
                (max-width: 1024px) 35vw,
                25vw
              "
            />
          </div>
        </div>

        {/* Content */}

        <div className="px-3 pt-3 pb-3 sm:px-5 sm:pt-4 sm:pb-4">
          {/* Product Name */}

          <h3 className="text-base font-bold leading-tight text-slate-900 sm:text-xl">
            {product.name}
          </h3>

          {/* Volume */}

          {productVolume && (
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {productVolume}
            </p>
          )}

          {/* Stock Information */}

          <p
            className={`mt-1 text-xs leading-4 sm:text-sm sm:leading-normal ${
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

          {/* Description */}

          <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-slate-500 sm:text-[13px] sm:leading-5">
            {product.description}
          </p>

          {/* Price */}

          <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
            <span className="text-lg font-black text-emerald-700 sm:text-2xl">
              ₹{productPrice.toLocaleString("en-IN")}
            </span>

            {/* Arrow */}

            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-emerald-700
                text-white
                transition-all
                duration-300
                group-hover:rotate-45
                group-hover:bg-emerald-600
                sm:h-10
                sm:w-10
              "
            >
              <ArrowRight
                size={16}
                className="sm:h-[18px] sm:w-[18px]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}