import { PrismaClient, RefreshToken } from "../generated/prisma/client";
import { BaseRepository } from "./base.repository";

export class RefreshTokenRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async upsert(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return this.prisma.refreshToken.upsert({
      where: { token: data.token },
      update: {},
      create: data,
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });
  }

  async delete(token: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  }
}
