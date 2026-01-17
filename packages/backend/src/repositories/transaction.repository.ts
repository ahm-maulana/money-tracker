import { Prisma, PrismaClient } from "../generated/prisma/client";
import { TRANSACTION_TYPE_ARRAY } from "../types/common";
import { TransactionResponse } from "../types/transaction.types";
import {
  TransactionInput,
  TransactionQuery,
} from "../validation/transaction.validation";
import { BaseRepository } from "./base.repository";

type TransactionType = (typeof TRANSACTION_TYPE_ARRAY)[number];

const TRANSACTION_SELECT: Prisma.TransactionSelect = {
  id: true,
  name: true,
  amount: true,
  description: true,
  date: true,
  category: {
    select: {
      id: true,
      name: true,
      type: true,
    },
  },
  updatedAt: true,
  userId: true,
} as const;

export class TransactionRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(
    userId: string,
    data: TransactionInput & { type: TransactionType }
  ): Promise<TransactionResponse> {
    return this.prisma.transaction.create({
      data: {
        userId,
        ...data,
      },
      select: TRANSACTION_SELECT,
    });
  }

  async findAll(
    userId: string,
    options: TransactionQuery
  ): Promise<{
    data: TransactionResponse[];
    total: number;
  }> {
    const skip = (options.page - 1) * options.limit;
    const amountFilter: Prisma.IntFilter | undefined =
      options.minAmount || options.maxAmount
        ? {
            ...(options.minAmount && { gte: options.minAmount }),
            ...(options.maxAmount && { lte: options.maxAmount }),
          }
        : undefined;
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(options.type && { type: options.type }),
      ...(options.categoryId && { categoryId: options.categoryId }),
      ...(amountFilter && {
        amount: amountFilter,
      }),
      ...(options.search && {
        OR: [
          {
            name: {
              contains: options.search,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: options.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: options.limit,
        select: TRANSACTION_SELECT,
        orderBy: {
          [options.sortBy]: options.sortOrder,
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findById(id: string): Promise<TransactionResponse | null> {
    return this.prisma.transaction.findUnique({
      where: {
        id,
      },
      select: TRANSACTION_SELECT,
    });
  }

  async update(
    id: string,
    data: TransactionInput & { type: TransactionType }
  ): Promise<TransactionResponse> {
    return this.prisma.transaction.update({
      where: {
        id,
      },
      data,
      select: TRANSACTION_SELECT,
    });
  }

  async delete(id: string): Promise<TransactionResponse> {
    return this.prisma.transaction.delete({
      where: {
        id,
      },
      select: TRANSACTION_SELECT,
    });
  }

  async countByCategory(categoryId: string): Promise<number> {
    return this.prisma.transaction.count({
      where: {
        categoryId,
      },
    });
  }
}
