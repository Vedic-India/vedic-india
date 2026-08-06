import { z } from "zod";

const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  stock: z.coerce
    .number()
    .int()
    .min(0, "Stock cannot be negative"),
});

export const productCreateSchema = productBaseSchema.extend({
  images: z
    .any()
    .refine(
      (files) => files?.length > 0,
      "At least one image is required."
    ),
});

export const productUpdateSchema = productBaseSchema;

export const productSchema = productCreateSchema;