import z from "zod";

export type TransactionType = "INCOME" | "EXPENSE";

export const transactionParamsSchema = z.object({
  id: z.uuid("Invalid category ID format"),
});

export const transactionSchema = z.object({
  name: z.string().min(1, "Transaction name is required.").max(100),
  amount: z.number().positive(),
  description: z.string().optional(),
  date: z.coerce.date().max(new Date(), "Date can not be in the future."),
  categoryId: z.uuid(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
