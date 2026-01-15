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

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id: userId } = req.user;
    const categoryData = req.body as CreateCategoryInput;

    const category = await this.categoryService.create(userId, categoryData);

    ResponseUtil.success(res, category, "Category created successfully.", 201);
  };

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id: userId } = req.user;
    const categories = await this.categoryService.getAll(userId);

    ResponseUtil.success(res, categories);
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id: userId } = req.user;
    const { id } = req.params as { id: string };
    const data = req.body as UpdateCategoryInput;
    const category = await this.categoryService.update(id, userId, data);

    ResponseUtil.success(res, category, "Category updated successfully.");
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id: userId } = req.user;
    const { id } = req.params as { id: string };

    await this.categoryService.delete(id, userId);

    ResponseUtil.success(res, null, "Category deleted successfully.");
  };
}
