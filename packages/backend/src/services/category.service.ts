import { Category } from "../generated/prisma/client";
import { CategoryRepository } from "../repositories/category.repository";
import { ConflictError, NotFoundError } from "../utils/error.util";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validation/category.validation";

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(
    userId: string,
    data: CreateCategoryInput
  ): Promise<Category> {
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

  async getAllCategories(userId: string): Promise<Category[]> {
    return this.categoryRepository.findAll(userId);
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    data: UpdateCategoryInput
  ): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(
      userId,
      categoryId
    );

    if (!existingCategory) {
      throw new NotFoundError("Category not found.");
    }

    const category = await this.categoryRepository.update(
      userId,
      categoryId,
      data
    );

    return category;
  }

  async deleteCategory(userId: string, categoryId: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(
      userId,
      categoryId
    );

    if (!existingCategory) {
      throw new NotFoundError("Category not found.");
    }

    return this.categoryRepository.delete(userId, categoryId);
  }
}
