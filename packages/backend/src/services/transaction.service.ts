import { CategoryRepository } from "../repositories/category.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { TransactionResponse } from "../types/transaction.types";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../utils/error.util";
import { TransactionInput } from "../validation/transaction.validation";

export class TransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async create(
    userId: string,
    data: TransactionInput
  ): Promise<TransactionResponse> {
    // Check if category exist
    const category = await this.categoryRepository.findById(data.categoryId);

    if (!category) {
      throw new ValidationError("Category ID not exist");
    }

    const transaction = await this.transactionRepository.create(userId, {
      ...data,
      type: category.type,
    });

    return transaction;
  }

  async getAll(userId: string): Promise<TransactionResponse[]> {
    const transactions = await this.transactionRepository.findAll(userId);

    return transactions;
  }

  async getById(id: string, userId: string): Promise<TransactionResponse> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    if (transaction.userId !== userId) {
      throw new ForbiddenError(
        "Forbidden: You're not the owner of this transaction"
      );
    }

    return transaction;
  }

  async update(
    id: string,
    userId: string,
    data: TransactionInput
  ): Promise<TransactionResponse> {
    // Check if transaction exist
    const existingTransaction = await this.transactionRepository.findById(id);

    if (!existingTransaction) {
      throw new NotFoundError("Transaction not found.");
    }

    if (existingTransaction.userId !== userId) {
      throw new ForbiddenError(
        "Forbidden: You're not the owner of this transaction"
      );
    }

    // Check if category exist
    const category = await this.categoryRepository.findById(data.categoryId);

    if (!category) {
      throw new ValidationError("Category ID not exist");
    }

    // Check category ownership
    if (category.userId !== userId) {
      throw new ForbiddenError(
        "Forbidden: You're not the owner of this category"
      );
    }

    const transaction = await this.transactionRepository.update(id, {
      ...data,
      type: category.type,
    });

    return transaction;
  }

  async delete(id: string, userId: string): Promise<void> {
    const existingTransaction = await this.transactionRepository.findById(id);

    if (!existingTransaction) {
      throw new NotFoundError("Transaction not found.");
    }

    if (existingTransaction.userId !== userId) {
      throw new ForbiddenError(
        "Forbidden: You're not the owner of this transaction"
      );
    }

    await this.transactionRepository.delete(id);
  }
}
