import { AuthRepository } from "../repositories/auth.repository";
import { ConflictError, UnauthorizedError } from "../utils/error.util";
import { LoginInput, RegisterInput } from "../validation/auth.validation";
import bcrypt from "bcrypt";
import { JwtUtil, TokenPair } from "../utils/jwt.util";
import {
  AuthResponse,
  excludePassword,
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
    return this.refreshTokenRepository.create({
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
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

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

  async refresh(refreshToken: string): Promise<TokenPair> {
    // Verify old token
    const decoded = JwtUtil.verifyRefreshToken(refreshToken);

    // Check if user exist
    const user = await this.authRepository.findById(decoded.userId);

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    // Check if old token exists in database and is not revoked
    const storedToken = await this.refreshTokenRepository.findByToken(
      refreshToken
    );

    if (!storedToken || storedToken.isRevoked) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    // Revoke old token
    const revokedToken = await this.refreshTokenRepository.revoke(refreshToken);

    // Generate new token pair
    const token = JwtUtil.generateTokenPair({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Store new refresh token
    await this.createRefreshToken(token.refreshToken, user.id);

    return token;
  }

  async logout(token: string): Promise<void> {
    await this.refreshTokenRepository.revoke(token);
  }
}
