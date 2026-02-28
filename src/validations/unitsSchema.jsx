import { z } from "zod";

export const unitsSchema = z.object({
  name_ar: z
    .string({ required_error: "Category Name in Arabic is required" })
    .trim()
    .min(2, "Category Arabic Name must be at least 2 characters"),

  name_en: z
    .string({ required_error: "Category Name in English is required" })
    .trim()
    .min(2, "Category English Name must be at least 2 characters"),

  is_active: z.boolean().optional(),

  symbol: z
    .string({ required_error: "Symbol is required" })
    .trim()
    .min(1, "Symbol is required")
    .max(10, "Symbol must be at most 10 characters"),
});
