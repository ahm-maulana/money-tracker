import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  transactionParamsSchema,
  transactionQuerySchema,
  transactionSchema,
} from "../validation/transaction.validation";
import { asyncHandler } from "../middleware/error.middleware";
import { TransactionController } from "../controllers/transaction.controller";

export const createTransactionRoutes = (controller: TransactionController) => {
  const router = Router();
  router.use(authMiddleware);

  router.post(
    "/",
    validate(transactionSchema),
    asyncHandler(controller.create)
  );

  router.get(
    "/",
    validate(transactionQuerySchema, "query"),
    asyncHandler(controller.getAll)
  );

  router.get(
    "/:id",
    validate(transactionParamsSchema, "params"),
    asyncHandler(controller.getById)
  );

  router.patch(
    "/:id",
    validate(transactionParamsSchema, "params"),
    validate(transactionSchema),
    asyncHandler(controller.update)
  );

  router.delete(
    "/:id",
    validate(transactionParamsSchema, "params"),
    asyncHandler(controller.delete)
  );

  return router;
};
