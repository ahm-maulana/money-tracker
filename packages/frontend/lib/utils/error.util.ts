import { AxiosError } from "axios";

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
}

export function getErrorMessage(error: unknown): string {
  // Handle axios errors
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.error) {
      return data.error;
    }

    if (data?.message) {
      return data.message;
    }

    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your connection.";
    }

    // Generic axios error
    return error.message || "An unexpected error occurred";
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle strings
  if (typeof error === "string") {
    return error;
  }

  // Fallback
  return "An unexpected error occurred";
}
