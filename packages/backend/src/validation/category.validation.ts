import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
});

export const categoryParamsSchema = z.object({
  id: z.uuid("Invalid category ID format"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
