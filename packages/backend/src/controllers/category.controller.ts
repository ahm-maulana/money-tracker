import { CategoryService } from "../services/category.service";
import { Response } from "express";
import { AuthenticatedRequest } from "../types/api.types";
import {
  CategoryQuery,
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
    const query = req.query as unknown as CategoryQuery;

    const { page, limit, ...queryData } = query;

    const { data, total } = await this.categoryService.getAll(userId, {
      page: page ?? 1,
      limit: limit ?? 10,
      ...queryData,
    });

    const totalPages = Math.ceil(total / (query.limit ?? 10));

    ResponseUtil.success(res, data, "Categories retrieved successfully.", 200, {
      timestamp: new Date().toISOString(),
      pagination: {
        page: page ?? 1,
        limit: limit ?? 10,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: queryData,
    });
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
