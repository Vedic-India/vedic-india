"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import Container from "@/components/layout/Container";

import ProductCard from "./ProductCard";
import AdminProductActions from "./AdminProductActions";
import ProductFormDialog from "./ProductFormDialog";

import { useProducts } from "@/hooks/queries/useProducts";
import { useCreateProduct } from "@/hooks/mutations/useCreateProduct";
import { useUpdateProduct } from "@/hooks/mutations/useUpdateProduct";
import { useAuth } from "@/context/AuthContext";

const getDefaultProductValues = (product) => ({
  name: product?.name ?? "",
  description: product?.description ?? "",
  price: product?.price ?? "",
  stock: product?.stock ?? "",
});

export default function ProductsGrid() {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProducts();

  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const dialogMode = selectedProduct ? "edit" : "create";

  const defaultValues = useMemo(
    () => getDefaultProductValues(selectedProduct),
    [selectedProduct]
  );

  const isPending =
    createProductMutation.isPending || updateProductMutation.isPending;

  const handleDialogOpenChange = (value) => {
    if (!value) {
      setSelectedProduct(null);
    }

    setIsDialogOpen(value);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (productData) => {
    if (selectedProduct) {
      await updateProductMutation.mutateAsync({
        slug: selectedProduct.slug,
        productData,
      });
    } else {
      await createProductMutation.mutateAsync(productData);
    }

    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className="bg-slate-50 py-12">
      <Container>
        {/* Admin Header */}

        {isAdmin && (
          <AdminProductActions
            onAddProduct={handleAddProduct}
          />
        )}

        {/* Loading */}

        {isLoading && (
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-107.5 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {/* Error */}

        {!isLoading && isError && (
          <div className="py-20 text-center">
            <h2 className="text-xl font-semibold text-red-600">
              Failed to load products
            </h2>

            <p className="mt-2 text-slate-500">
              {error?.response?.data?.message ||
                "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {/* Empty */}

        {!isLoading && !isError && products.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold text-slate-800">
              No Products Found
            </h2>

            <p className="mt-2 text-slate-500">
              {isAdmin
                ? "Click 'Add Product' to add your first product."
                : "Please check back later."}
            </p>
          </div>
        )}

        {/* Products */}

        {!isLoading && !isError && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto grid max-w-7xl grid-cols-2 gap-6 xl:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product._id ?? product.slug}
                product={product}
                onEdit={handleEditProduct}
              />
            ))}
          </motion.div>
        )}

        {/* Product Dialog */}

        <ProductFormDialog
          key={selectedProduct?.slug ?? "create"}
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          onSubmit={handleSubmit}
          isPending={isPending}
          mode={dialogMode}
          defaultValues={defaultValues}
        />
      </Container>
    </section>
  );
}