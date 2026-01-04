import { apiClient } from "@/lib/api";
import { LoginInput, RegisterInput } from "./validation";
import { AuthResponse, User } from "./types";
import { ApiResponse } from "@/types/api";

export const authApi = {
  register: (data: RegisterInput) =>
    apiClient.post<ApiResponse<User>>("/auth/register", data),
  login: (credentials: LoginInput) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials),
  refresh: () => apiClient.post<ApiResponse<AuthResponse>>("/auth/refresh"),
  logout: () => apiClient.post<void>("/auth/logout"),
};
