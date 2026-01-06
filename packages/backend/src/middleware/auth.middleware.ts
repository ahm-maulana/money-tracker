import { Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError, UnauthorizedError } from "../utils/error.util";
import { AuthenticatedRequest } from "../types/api.types";
import { prisma } from "../config/database";
import { config } from "../config/config";
import { CustomJwtPayload } from "../utils/jwt.util";

const authMiddlewareImpl = async (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Access token required");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new UnauthorizedError("Access token required");
    }

    // Verify access token
    const accessTokenSecret = config.jwt.access.secret;
    if (!accessTokenSecret) {
      throw new AppError("Access token not configured", 500);
    }

    const decoded = jwt.verify(token, accessTokenSecret) as CustomJwtPayload;

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid or expired token"));
    } else {
      next(error);
    }
  }
};

export const authMiddleware = authMiddlewareImpl as unknown as RequestHandler;

// Optional auth middleware - doesn't throw error if no token
export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      if (token) {
        const jwtSecret = process.env.JWT_SECRET;
        if (jwtSecret) {
          const decoded = jwt.verify(token, jwtSecret) as any;

          const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
              id: true,
              email: true,
              name: true,
            },
          });

          if (user) {
            req.user = {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication on optional routes
    next();
  }
};
