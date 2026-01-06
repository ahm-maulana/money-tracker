import { Category, PrismaClient } from "../generated/prisma/client";
import { CreateCategoryInput } from "../validation/category.validation";
import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(
    data: CreateCategoryInput & { userId: string }
  ): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        userId,
      },
    });
  }

  async findByName(userId: string, name: string): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: {
        userId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async findById(userId: string, categoryId: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: {
        id: categoryId,
        userId,
      },
    });
  }

  async delete(userId: string, categoryId: string): Promise<Category> {
    return this.prisma.category.delete({
      where: {
        id: categoryId,
        userId,
      },
    });
  }
}
