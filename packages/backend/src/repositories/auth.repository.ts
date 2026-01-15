import { PrismaClient, User } from "../generated/prisma/client";
import { RegisterInput } from "../validation/auth.validation";
import { BaseRepository } from "./base.repository";

export class AuthRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: Omit<RegisterInput, "confirmPassword">): Promise<User> {
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
}
