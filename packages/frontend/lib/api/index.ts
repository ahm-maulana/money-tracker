// Re-export everything for convenient imports
export { apiClient } from './client';
export { API_CONFIG } from './config';

// API modules
export { authApi } from './auth';
export { transactionsApi } from './transactions';
export { categoriesApi } from './categories';

// Types
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from './auth';

export type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from './transactions';

export type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './categories';
