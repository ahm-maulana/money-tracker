import z from "zod";

export const categoryParamsSchema = z.object({
  id: z.uuid("Invalid category ID format"),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required.").max(100),
  color: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
