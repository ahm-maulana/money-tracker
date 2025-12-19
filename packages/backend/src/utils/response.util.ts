import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ResponseUtil {
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
  ) {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
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
