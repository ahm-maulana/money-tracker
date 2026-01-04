import { apiClient } from './client';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  type: 'income' | 'expense';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  type: 'income' | 'expense';
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {}

export const transactionsApi = {
  getAll: (params?: { type?: 'income' | 'expense'; categoryId?: string }) =>
    apiClient.get<Transaction[]>('/transactions', { params }),

  getById: (id: string) =>
    apiClient.get<Transaction>(`/transactions/${id}`),

  create: (data: CreateTransactionDto) =>
    apiClient.post<Transaction>('/transactions', data),

  update: (id: string, data: UpdateTransactionDto) =>
    apiClient.patch<Transaction>(`/transactions/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/transactions/${id}`),

  getSummary: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<{
      totalIncome: number;
      totalExpense: number;
      balance: number;
    }>('/transactions/summary', { params }),
};
