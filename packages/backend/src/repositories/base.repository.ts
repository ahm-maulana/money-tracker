import { PrismaClient } from "../generated/prisma/client";

export abstract class BaseRepository {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
