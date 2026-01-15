import { PrismaClient } from "../generated/prisma/client";
import { TransactionResponse } from "../types/transaction.types";
import {
  TransactionInput,
  TransactionType,
} from "../validation/transaction.validation";
import { BaseRepository } from "./base.repository";

const TRANSACTION_SELECT = {
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

  async findAll(userId: string): Promise<TransactionResponse[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
      },
      select: TRANSACTION_SELECT,
    });
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
