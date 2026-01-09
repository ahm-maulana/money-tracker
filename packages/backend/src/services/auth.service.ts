import { AuthRepository } from "../repositories/auth.repository";
import { ConflictError, UnauthorizedError } from "../utils/error.util";
import { LoginInput, RegisterInput } from "../validation/auth.validation";
import bcrypt from "bcrypt";
import { JwtUtil } from "../utils/jwt.util";
import {
  AuthResponse,
  excludePassword,
  SessionResponse,
  UserWithoutPassword,
} from "../types/auth.types";
import { config } from "../config/config";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository";

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private refreshTokenRepository: RefreshTokenRepository
  ) {}

  private async createRefreshToken(token: string, userId: string) {
    return this.refreshTokenRepository.upsert({
      token,
      userId,
      expiresAt: new Date(Date.now() + config.jwt.refresh.expiresIn * 1000),
    });
  }

  async register(data: RegisterInput): Promise<UserWithoutPassword> {
    const { email, name, password } = data;

    // Check if user already exist
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already exist");
    }

    // Password hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.authRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return excludePassword(user);
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    // Check if user exists
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    // Check the password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    // Generate token
    const token = JwtUtil.generateTokenPair(user);

    // Store refresh token
    await this.createRefreshToken(token.refreshToken, user.id);

    return {
      user: excludePassword(user),
      token: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      },
    };
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    // Verify old token
    const decoded = JwtUtil.verifyRefreshToken(refreshToken);

    // Check if user exist
    const user = await this.authRepository.findById(decoded.userId);

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    // Check if old token exists in database
    const storedToken = await this.refreshTokenRepository.findByToken(
      refreshToken
    );

    if (!storedToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    // Delete old token
    await this.refreshTokenRepository.delete(refreshToken);

    // Generate new token pair
    const token = JwtUtil.generateTokenPair({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Store new refresh token
    await this.createRefreshToken(token.refreshToken, user.id);

    return {
      user: excludePassword(user),
      token: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      },
    };
  }

  async session(token: string): Promise<SessionResponse> {
    // Verify old token
    const decoded = JwtUtil.verifyRefreshTokenSafe(token);

    if (!decoded) {
      return {
        isAuthenticated: false,
      };
    }

    // Check if user exists
    const user = await this.authRepository.findById(decoded.userId);

    if (!user) {
      return {
        isAuthenticated: false,
      };
    }

    // Check if old token exists in database
    const storedToken = await this.refreshTokenRepository.findByToken(token);

    if (!storedToken) {
      return {
        isAuthenticated: false,
      };
    }

    // Generate new access token
    const accessToken = JwtUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      isAuthenticated: true,
      token: accessToken,
      user: excludePassword(user),
    };
  }

  async logout(token: string): Promise<void> {
    const existingToken = await this.refreshTokenRepository.findByToken(token);

    if (existingToken) {
      await this.refreshTokenRepository.delete(token);
    }
  }
}
