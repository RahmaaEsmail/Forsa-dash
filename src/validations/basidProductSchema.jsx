import { z } from "zod";

/** ---------------------------
 * Helpers
 * -------------------------- */
const requiredText = (label) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`);

const optionalNumber = (label) =>
  z.coerce
    .number()
    .refine((v) => Number.isFinite(v), `${label} must be a valid number`)
    .optional();

/** ---------------------------
 * Image schema (edit accepts url/object)
 * -------------------------- */
const imageSchemaEdit = z.union([
  z.instanceof(File),
  z.string().url(),
  z.object({ url: z.string().url() }),
  z.null(),
  z.undefined(),
  z.literal(""),
]);

/** ---------------------------
 * Existing attachments from API
 * (strings or objects) — NOT files
 * -------------------------- */
const existingAttachmentSchema = z.union([
  z.string().url(),
  z.object({
    id: z.union([z.number(), z.string()]).optional(),
    url: z.string().url().optional(),
    path: z.string().optional(),
    name: z.string().optional(),
  }),
]);

/** ---------------------------
 * New files only
 * -------------------------- */
const newFilesSchemaCreate = z
  .array(z.instanceof(File))
  .min(1, "Please upload at least 1 file")
  .max(10, "Max 10 files");

const newFilesSchemaEdit = z
  .array(z.instanceof(File))
  .max(10, "Max 10 files")
  .optional()
  .default([]);

/** ---------------------------
 * Schemas
 * -------------------------- */
export const makeBasicProductDataSchema = (mode) =>
  z.object({
    name_ar: requiredText("name_ar").min(2, "Product Arabic Name must be at least 2 character"),
    name_en: requiredText("name_en").min(2, "Product English Name must be at least 2 character"),
    product_code: requiredText("product_code"),
    product_sku: requiredText("product_sku"),
    category: requiredText("category"),
    brand: requiredText("brand"),
    unit_of_measure: z.array(z.any()).optional(),
    description: z.string().optional(),

    // ✅ Create requires File
    // ✅ Edit accepts existing url/object OR File OR empty
    image:
      mode === "create"
        ? z.instanceof(File, { message: "Image is Required" })
        : imageSchemaEdit.optional(),
  });

export const productPriceValidation = z
  .object({
    currency: z.string({ required_error: "Currency is required" }),
    cost_price: optionalNumber("cost_price"),
    selling_price: optionalNumber("selling_price"),
    discount_role: optionalNumber("discount_role"),
  })
  .superRefine((data, ctx) => {
    if (data.cost_price != null && data.selling_price != null && data.selling_price < data.cost_price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selling_price"],
        message: "Selling price must be >= cost price",
      });
    }
  });

export const productInventoryValidation = z.object({
  supplier: z.string().optional(),
  min_stock: z.coerce.number().optional(),
  max_stock: z.coerce.number().optional(),
  avg_time: z.coerce.number().optional(),
  storage_location_code: z.string().optional(),
});

export const makeProductAttachmentValidation = (mode) =>
  z.object({
    // ✅ existing attachments (urls/objects) — always optional
    attachment: z.array(existingAttachmentSchema).optional().default([]),

    // ✅ new uploads only
    attachment_files: mode === "create" ? newFilesSchemaCreate : newFilesSchemaEdit,
  });

export const makeAddProductSchema = (mode) =>
  makeBasicProductDataSchema(mode)
    .merge(productPriceValidation)
    .merge(productInventoryValidation)
    .merge(makeProductAttachmentValidation(mode));