import { z } from "zod";

import { emailSchema } from "@/schemas/auth.schema";

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

const pincodeSchema = z
  .string()
  .trim()
  .min(1, "Pincode is required")
  .regex(/^\d{6}$/, "Enter a valid 6-digit pincode");

export const addressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters"),
  phone: phoneSchema,
  addressLine1: z
    .string()
    .trim()
    .min(5, "Address line 1 must be at least 5 characters"),
  addressLine2: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .trim()
    .min(2, "City is required"),
  state: z
    .string()
    .trim()
    .min(2, "State is required"),
  pincode: pincodeSchema,
  country: z
    .string()
    .trim()
    .min(2, "Country is required"),
  isDefault: z.boolean().default(false),
});

export const addressContactSchema = z.object({
  email: emailSchema,
});