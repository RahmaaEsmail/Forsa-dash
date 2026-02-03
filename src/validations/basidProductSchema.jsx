import z, { file } from "zod";

const requiredText = (label) =>
  z.string({ required_error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`);

export const basicProductDataSchema = z.object({
  name_ar: requiredText("name_ar").min(2, "Product Arabic Name must be at least 2 character"),
  name_en: requiredText("name_en").min(2, "Product English Name must be at least 2 character"),
  product_code: requiredText("product_code"),
  product_sku: requiredText("product_sku"),
  category: requiredText("category"),
  subcategory: requiredText("subcategory"),
  brand: requiredText('brand'),
  unit_of_measure: z.string().optional(),
  description_ar : z.string().optional(),
  description_en : z.string().optional(),
  image: z.any().refine(file => file instanceof File, "Image is Required").optional()
})



const optionalNumber = (label) => {
  return z.coerce.number().refine((v) => Number.isFinite(v), `${label} must be a valid number`).optional()
}

export const productPriceValidation = z.object({
  currency: z.string({ error: "Currency is required" }),
  cost_price: optionalNumber("cost_price"),
  selling_price: optionalNumber("selling_price"),
  discount_role: optionalNumber("discount_role")
})
  .superRefine((data, ctx) => {
    if (data.cost_price != null && data?.selling_price != null && data?.selling_price < data?.cost_price) {
      ctx.addIssue({
        path: ["selling_price"],
        message: "Selling price must be >= cost price"
      })
    }
  })

export const productInventoryValidation = z.object({
  supplier: z.string().optional(),
  min_stock: z.coerce.number().optional(),
  max_stock: z.coerce.number().optional(),
  avg_time: z.coerce.number().optional(),
  storage_location_code: z.string().optional(),
})

export const productAttachmentValidation = z.object({
  attachment: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least 1 file")
    .max(10, "Max 10 files"),
})

export const addProductSchema = basicProductDataSchema.merge(productPriceValidation).merge(productInventoryValidation).merge(productAttachmentValidation);