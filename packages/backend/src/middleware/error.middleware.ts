import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.util";
import { ResponseUtil } from "../utils/response.util";
import { config } from "../config/config";

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle different types of error
  if (error instanceof AppError) {
    ResponseUtil.error(res, error.message, error.statusCode);
  } else if (error.name === "ValidationError") {
    ResponseUtil.error(res, "Validation failed", 400, error);
  } else if (error.name === "CastError") {
    ResponseUtil.error(res, "Invalid ID format", 400, error);
  } else if (error.name === "JsonWebTokenError") {
    ResponseUtil.error(res, "Invalid Token", 401, error);
  } else if (error.name === "TokenExpiredError") {
    ResponseUtil.error(res, "Token has expired", 401, error);
  } else {
    const statusCode = (error as any).statusCode || 500;
    const message =
      config.nodeEnv === "production" ? "Internal server error" : error.message;

    ResponseUtil.error(res, message, statusCode);
  }
};

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
