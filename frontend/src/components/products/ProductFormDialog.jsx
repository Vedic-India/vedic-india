"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/label";

import {
  productCreateSchema,
  productUpdateSchema,
} from "@/schemas/product.schema";

export default function ProductFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  mode = "create",
  defaultValues = {
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
  },
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      mode === "create"
        ? productCreateSchema
        : productUpdateSchema
    ),
    defaultValues,
    shouldUnregister: true,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const submit = async (data) => {
    try {
      const productData =
        mode === "create"
          ? {
              ...data,
              images: Array.from(data.images ?? []),
            }
          : data;

      await onSubmit(productData);

      reset(defaultValues);
    } catch {
      // Mutation already handles toast.
      // Keep the dialog open.
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isPending) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-xl"
        onEscapeKeyDown={(event) => {
          if (isPending) {
            event.preventDefault();
          }
        }}
        onPointerDownOutside={(event) => {
          if (isPending) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submit)}
          className="space-y-5"
        >
          {mode === "create" && (
            <div>
              <Label htmlFor="images">Images</Label>

              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                disabled={isPending}
                {...register("images")}
              />

              {errors.images && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.images.message}
                </p>
              )}
            </div>
          )}

          {/* Name */}

          <div>
            <Label htmlFor="name">Name</Label>

            <Input
              id="name"
              disabled={isPending}
              {...register("name")}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}

          <div>
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              rows={4}
              disabled={isPending}
              {...register("description")}
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price & Stock */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>

              <Input
                id="price"
                type="number"
                disabled={isPending}
                {...register("price")}
              />

              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>

              <Input
                id="stock"
                type="number"
                disabled={isPending}
                {...register("stock")}
              />

              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="min-w-36"
            >
              {isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                ? "Create Product"
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}