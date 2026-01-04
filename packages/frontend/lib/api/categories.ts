import { apiClient } from './client';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const categoriesApi = {
  getAll: (params?: { type?: 'income' | 'expense' }) =>
    apiClient.get<Category[]>('/categories', { params }),

  getById: (id: string) =>
    apiClient.get<Category>(`/categories/${id}`),

  create: (data: CreateCategoryDto) =>
    apiClient.post<Category>('/categories', data),

  update: (id: string, data: UpdateCategoryDto) =>
    apiClient.patch<Category>(`/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/categories/${id}`),
};
