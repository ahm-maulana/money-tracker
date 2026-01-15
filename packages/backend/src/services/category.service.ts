import { Category } from "../generated/prisma/client";
import { CategoryRepository } from "../repositories/category.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../utils/error.util";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validation/category.validation";

export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async create(userId: string, data: CreateCategoryInput): Promise<Category> {
    const existingCategory = await this.categoryRepository.findByName(
      userId,
      data.name
    );

    if (existingCategory) {
      throw new ConflictError("Category already exist.");
    }

    const category = await this.categoryRepository.create({
      ...data,
      userId,
    });

    return category;
  }

  async getAll(userId: string): Promise<Category[]> {
    return this.categoryRepository.findAll(userId);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateCategoryInput
  ): Promise<Category> {
    // Check if category exist
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundError("Category not found.");
    }

    // Check category ownership
    if (existingCategory.userId !== userId) {
      throw new ForbiddenError(
        "Forbidden: You're not the owner of this category"
      );
    }

    const category = await this.categoryRepository.update(id, {
      name: data.name,
      color: data.color,
    });

    return category;
  }

  async delete(id: string, userId: string): Promise<Category> {
    // Check if category exist
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundError("Category not found.");
    }

    // Check category ownership
    if (existingCategory.userId !== userId) {
      throw new ForbiddenError(
        "Forbidden: You're not the owner of this category"
      );
    }

    // Check if category has transactions BEFORE deleting
    const transactionCount = await this.transactionRepository.countByCategory(
      id
    );

    if (transactionCount > 0) {
      throw new BadRequestError(
        "Cannot delete category because it has transactions"
      );
    }

    return this.categoryRepository.delete(id);
  }
}
