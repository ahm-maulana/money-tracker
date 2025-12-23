import { PrismaClient, RefreshToken, User } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";

export class AuthRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: any): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async revokeToken(token: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      where: {
        token,
      },
      data: {
        isRevoked: true,
      },
    });
  }
}
