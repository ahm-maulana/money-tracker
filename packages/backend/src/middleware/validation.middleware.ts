import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";
import { ResponseUtil } from "../utils/response.util";

export const validate =
  (schema: ZodObject, source: "body" | "query" | "params" = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      await schema.parseAsync(data);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors properly
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        ResponseUtil.error(res, "Validation failed", 400, formattedErrors);
      } else {
        next(error);
      }
    }
  };
