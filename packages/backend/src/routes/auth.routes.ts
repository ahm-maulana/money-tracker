import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { loginSchema, registerSchema } from "../validation/auth.validation";
import { AuthController } from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/error.middleware";

export const createAuthRoutes = (controller: AuthController) => {
  const router = Router();

  router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(controller.register)
  );

  router.post("/login", validate(loginSchema), asyncHandler(controller.login));

  router.post("/refresh", asyncHandler(controller.refresh));

  router.get("/session", asyncHandler(controller.session));

  router.post("/logout", asyncHandler(controller.logout));

  return router;
};
