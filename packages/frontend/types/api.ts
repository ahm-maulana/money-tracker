export type ApiResponse<T = any> =
  | {
      success: true;
      data?: T;
      message: string;
    }
  | {
      success: false;
      message: string;
      error?: string;
      errors?: Record<string, string[]>;
    };
