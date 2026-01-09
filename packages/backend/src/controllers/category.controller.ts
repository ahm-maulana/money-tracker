import { CategoryService } from "../services/category.service";
import { Response } from "express";
import { AuthenticatedRequest } from "../types/api.types";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validation/category.validation";
import { ResponseUtil } from "../utils/response.util";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id: userId } = req.user;
    const categoryData = req.body as CreateCategoryInput;

    const category = await this.categoryService.createCategory(
      userId,
      categoryData
    );

    ResponseUtil.success(res, category, "Category created successfully.", 201);
  };

  getCategories = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id: userId } = req.user;
    const categories = await this.categoryService.getAllCategories(userId);

    ResponseUtil.success(res, categories);
  };

  updateCategory = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id: userId } = req.user;
    const { id: categoryId } = req.params as { id: string };
    const data = req.body as UpdateCategoryInput;
    const category = await this.categoryService.updateCategory(
      userId,
      categoryId,
      data
    );

    ResponseUtil.success(res, category, "Category updated successfully.");
  };

  deleteCategory = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id: userId } = req.user;
    const { id: categoryId } = req.params as { id: string };

    await this.categoryService.deleteCategory(userId, categoryId);

    ResponseUtil.success(res, null, "Category deleted successfully.");
  };
}
