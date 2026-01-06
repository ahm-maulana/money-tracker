import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import { config } from "../config/config";
import { UnauthorizedError } from "./error.util";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  name?: string;
}

export class JwtUtil {
  /**
   * Generate JWT token for user
   */
  static generateAccessToken(user: {
    id: string;
    email: string;
    name: string;
  }): string {
    const payload: Omit<JwtPayload, "iat" | "exp"> = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const signOptions: SignOptions = {
      expiresIn: config.jwt.access.expiresIn as SignOptions["expiresIn"],
      issuer: "money-tracker-api",
      audience: "money-tracker-users",
    };

    return jwt.sign(payload, config.jwt.access.secret, signOptions);
  }

  static generateRefreshToken(user: { id: string; email: string }): string {
    const payload: Omit<JwtPayload, "iat" | "exp"> = {
      userId: user.id,
      email: user.email,
      jti: crypto.randomUUID(), // Unique token ID - prevents duplicates
    };

    const signOptions: SignOptions = {
      expiresIn: config.jwt.refresh.expiresIn as SignOptions["expiresIn"],
      issuer: "money-tracker-api",
      audience: "money-tracker-users",
    };

    return jwt.sign(payload, config.jwt.refresh.secret, signOptions);
  }

  /**
   * Verify JWT token
   */
  static verifyAccessToken(token: string): CustomJwtPayload {
    try {
      const verifyOptions: VerifyOptions = {
        issuer: "money-tracker-api",
        audience: "money-tracker-users",
      };

      const decoded = jwt.verify(
        token,
        config.jwt.access.secret,
        verifyOptions
      ) as CustomJwtPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Token has expired.");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid token.");
      }

      throw new UnauthorizedError("Token verification failed.");
    }
  }

  static verifyRefreshToken(token: string): CustomJwtPayload {
    try {
      const verifyOptions: VerifyOptions = {
        issuer: "money-tracker-api",
        audience: "money-tracker-users",
      };

      const decoded = jwt.verify(
        token,
        config.jwt.refresh.secret,
        verifyOptions
      ) as CustomJwtPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Token has expired.");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError(error.message || "Invalid token.");
      }

      throw new UnauthorizedError("Token verification failed.");
    }
  }

  static verifyRefreshTokenSafe(token: string): CustomJwtPayload | null {
    try {
      const verifyOptions: VerifyOptions = {
        issuer: "money-tracker-api",
        audience: "money-tracker-users",
      };

      return jwt.verify(
        token,
        config.jwt.refresh.secret,
        verifyOptions
      ) as CustomJwtPayload;
    } catch {
      return null;
    }
  }

  static generateTokenPair(user: {
    id: string;
    email: string;
    name: string;
  }): TokenPair {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }
}
