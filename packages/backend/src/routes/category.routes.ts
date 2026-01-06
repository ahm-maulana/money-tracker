import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validate } from "../middleware/validation.middleware";
import {
  categoryParamsSchema,
  createCategorySchema,
} from "../validation/category.validation";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

export const createCategoryRoutes = (controller: CategoryController) => {
  const router = Router();

  router.use(authMiddleware);

  router.post(
    "/",
    validate(createCategorySchema),
    asyncHandler(controller.createCategory)
  );

  router.get("/", asyncHandler(controller.getCategories));

  router.delete(
    "/:id",
    validate(categoryParamsSchema, "params"),
    asyncHandler(controller.deleteCategory)
  );

  return router;
};
