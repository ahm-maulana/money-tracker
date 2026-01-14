import { ApiResponse } from "@/types/api";
import { Category } from "./types";
import { apiClient } from "@/lib/api/client";
import { CreateCategoryInput, UpdateCategoryInput } from "./validation";

export const categoriesApi = {
  getAll: () => apiClient.get<ApiResponse<Category[]>>("/categories"),
  create: (data: CreateCategoryInput) =>
    apiClient.post<ApiResponse<Category>>("/categories", data),
  update: (categoryId: string, data: UpdateCategoryInput) =>
    apiClient.patch<ApiResponse<Category>>(`/categories/${categoryId}`, data),
  delete: (categoryId: string) =>
    apiClient.delete<ApiResponse>(`/categories/${categoryId}`),
};
