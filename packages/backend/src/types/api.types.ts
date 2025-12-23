import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

// Paginated Response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ApiResponse['meta'] & {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Express Request with User
export interface AuthenticatedRequest extends Request {
  user: JwtPayload & { id: string; email: string };
}

// Query Parameters
export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionQuery extends PaginationQuery {
  categoryId?: string;
  type?: 'INCOME' | 'EXPENSE';
  startDate?: string;
  endDate?: string;
  search?: string;
}