import z from "zod";
import { TRANSACTION_TYPE_ARRAY } from "../types/common";
import { paginationQuerySchema } from "./base.validation";

export const categoryParamsSchema = z.object({
  id: z.uuid("Invalid category ID format"),
});

export const categoryQuerySchema = paginationQuerySchema
  .extend({
    type: z.enum(TRANSACTION_TYPE_ARRAY).optional(),
  })
  .refine(
    (data) => {
      const allowedSortFields = ["createdAt", "updatedAt", "name"];
      return allowedSortFields.includes(data.sortBy);
    },
    {
      error: "Invalid sortBy field. Must be one of: createdAt, updatedAt, name",
      path: ["sortBy"],
    }
  );

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required.").max(100),
  color: z.string().optional(),
});

export type CategoryQuery = z.infer<typeof categoryQuerySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
