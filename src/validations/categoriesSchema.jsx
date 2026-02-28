import z from "zod";

export const categoriesSchema = z.object({
  name_ar: z.string({ required_error: `Category Name in Arabic is required` })
    .trim()
    .min(1, `Category Name in Arabic is required`).min(2, "Category Arabic Name must be at least 2 character"),
  name_en: z.string({ required_error: `Category Name in Arabic is required` })
    .trim()
    .min(1, `Category Name in Arabic is required`).min(2, "Category English Name must be at least 2 character"),

  desc_ar: z.string().optional(),
  desc_en: z.string().optional(),
  is_active:  z.boolean().optional(),
  parent_id : z.string().optional(),
})