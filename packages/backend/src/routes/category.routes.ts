import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validate } from "../middleware/validation.middleware";
import {
  categoryParamsSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../validation/category.validation";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

export const createCategoryRoutes = (controller: CategoryController) => {
  const router = Router();

  router.use(authMiddleware);

  router.post(
    "/",
    validate(createCategorySchema),
    asyncHandler(controller.create)
  );

  router.get("/", asyncHandler(controller.getAll));

  router.patch(
    "/:id",
    validate(categoryParamsSchema, "params"),
    validate(updateCategorySchema),
    asyncHandler(controller.update)
  );

  router.delete(
    "/:id",
    validate(categoryParamsSchema, "params"),
    asyncHandler(controller.delete)
  );

  return router;
};
