import { Category, Prisma, PrismaClient } from "../generated/prisma/client";
import {
  CategoryQuery,
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

  async findAll(
    userId: string,
    options: CategoryQuery
  ): Promise<{ data: Category[]; total: number }> {
    const skip = (options.page - 1) * options.limit;

    const where: Prisma.CategoryWhereInput = {
      userId,
      ...(options.type && { type: options.type }),
      ...(options.search && {
        name: {
          contains: options.search,
          mode: "insensitive" as const,
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: options.limit,
        orderBy: {
          [options.sortBy]: options.sortOrder,
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data,
      total,
    };
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
