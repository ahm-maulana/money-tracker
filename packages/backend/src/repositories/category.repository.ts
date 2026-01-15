import { Category, PrismaClient } from "../generated/prisma/client";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validation/category.validation";
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

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
