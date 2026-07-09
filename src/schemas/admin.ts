import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const productCategories = [
  "jacket",
  "snowboard",
  "ski",
  "goggles",
] as const;

export const displaySizes = ["XS", "S", "M", "L", "XL"] as const;

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string(),
  category: z.enum(productCategories),
  price: z.coerce.number().int().positive("Price must be positive"),
  images: z.array(z.url("Invalid image URL")).min(1, "At least one image"),
  stock: z.record(z.string(), z.coerce.number().int().min(0)),
  badge: z.string().optional(),
  colorLabel: z.string().optional(),
  fitNote: z.string().optional(),
  sizingInfo: z.array(z.string()),
  shippingInfo: z.array(z.string()),
  returnsInfo: z.array(z.string()),
});

export const orderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "EXPIRED",
  "CANCELLED",
]);

export const updateOrderStatusSchema = z.object({
  externalId: z.string().min(1),
  status: orderStatusSchema,
});

export const settingsSchema = z.object({
  xenditMode: z.enum(["test", "live"]),
  appUrl: z.url("Invalid app URL"),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
