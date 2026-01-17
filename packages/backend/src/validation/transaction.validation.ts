import z from "zod";
import { paginationQuerySchema } from "./base.validation";
import { TRANSACTION_TYPE_ARRAY } from "../types/common";

export const transactionParamsSchema = z.object({
  id: z.uuid("Invalid category ID format"),
});

export const transactionQuerySchema = paginationQuerySchema
  .extend({
    type: z.enum(TRANSACTION_TYPE_ARRAY).optional(),
    minAmount: z.coerce.number().positive().optional(),
    maxAmount: z.coerce.number().positive().optional(),
    categoryId: z.uuid().optional(),
  })
  .refine(
    (data) => {
      if (data.minAmount && data.maxAmount) {
        return data.minAmount <= data.maxAmount;
      }

      return true;
    },
    {
      error: "minAmount cannot be greater than maxAmount field",
      path: ["minAmount"],
    }
  )
  .refine(
    (data) => {
      const allowedSortFields = [
        "createdAt",
        "updatedAt",
        "date",
        "amount",
        "name",
      ];
      return allowedSortFields.includes(data.sortBy);
    },
    {
      error:
        "Invalid sortBy field. Must be one of: createdAt, updatedAt, date, amount, name",
      path: ["sortBy"],
    }
  );

export const transactionSchema = z.object({
  name: z.string().min(1, "Transaction name is required.").max(100),
  amount: z.number().positive(),
  description: z.string().optional(),
  date: z.coerce.date().max(new Date(), "Date can not be in the future."),
  categoryId: z.uuid(),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
