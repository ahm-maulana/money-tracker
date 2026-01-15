import { CategoryRepository } from "../repositories/category.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { TransactionResponse } from "../types/transaction.types";
import { NotFoundError, ValidationError } from "../utils/error.util";
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
    const category = await this.categoryRepository.findById(
      userId,
      data.categoryId
    );

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
    const transaction = await this.transactionRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    return transaction;
  }

  async update(
    id: string,
    userId: string,
    data: TransactionInput
  ): Promise<TransactionResponse> {
    // Check if transaction exist
    const existingTransaction =
      await this.transactionRepository.findByIdAndUserId(id, userId);

    if (!existingTransaction) {
      throw new NotFoundError("Transaction not found.");
    }

    // Check if category exist
    const category = await this.categoryRepository.findById(
      userId,
      data.categoryId
    );

    if (!category) {
      throw new ValidationError("Category ID not exist");
    }

    const transaction = await this.transactionRepository.update(id, userId, {
      ...data,
      type: category.type,
    });

    return transaction;
  }

  async delete(id: string, userId: string): Promise<void> {
    const existingTransaction = this.transactionRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!existingTransaction) {
      throw new NotFoundError("Transaction not found.");
    }

    await this.transactionRepository.delete(id, userId);
  }
}
