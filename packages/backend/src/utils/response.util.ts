import { Response } from "express";

export interface ApiResponse<Data = any, Meta = Record<string, any>> {
  success: boolean;
  data?: Data;
  message?: string;
  error?: string | string[];
  meta?: {
    timestamp: string;
    pagination?: Pagination;
    filters?: Meta;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class ResponseUtil {
  static success<Data, Meta>(
    res: Response,
    data?: Data,
    message?: string,
    statusCode: number = 200,
    meta?: {
      timestamp: string;
      pagination?: Pagination;
      filters?: Meta;
    }
  ) {
    const response: ApiResponse<Data, Meta> = {
      success: true,
      message,
      data,
      meta,
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    error?: any
  ) {
    const response: ApiResponse = {
      success: false,
      message,
      error: typeof error === "string" ? error : error?.message || error,
    };

    return res.status(statusCode).json(response);
  }
}
