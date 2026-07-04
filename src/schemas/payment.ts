import { z } from "zod";

const customerSchema = z.object({
  given_names: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  mobile_number: z
    .string()
    .trim()
    .regex(/^(\+62|62|0)[0-9]{9,13}$/)
    .optional(),
});

const lineItemSchema = z.object({
  name: z.string().trim().min(1).max(255),
  quantity: z.number().int().min(1).max(99),
  price: z.number().int().min(1),
});

export const createPaymentSchema = z.object({
  externalId: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, "externalId hanya huruf, angka, - dan _"),
  amount: z.number().int().min(1, "Amount minimal Rp 1"),
  description: z.string().trim().min(1).max(255),
  payerEmail: z.string().trim().email(),
  customer: customerSchema,
  items: z.array(lineItemSchema).min(1).max(50),
  successRedirectUrl: z.string().url(),
  failureRedirectUrl: z.string().url(),
  invoiceDurationSeconds: z.number().int().min(300).max(604_800).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
