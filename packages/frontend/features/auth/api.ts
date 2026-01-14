import { LoginInput, RegisterInput } from "./validation";
import { AuthResponse, SessionResponse, User } from "./types";
import { ApiResponse } from "@/types/api";
import { apiClient } from "@/lib/api/client";

export const authApi = {
  register: (data: RegisterInput) =>
    apiClient.post<ApiResponse<User>>("/auth/register", data),
  login: (credentials: LoginInput) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials),
  refresh: () => apiClient.post<ApiResponse<AuthResponse>>("/auth/refresh"),
  session: () => apiClient.get<ApiResponse<SessionResponse>>("/auth/session"),
  logout: () => apiClient.post<void>("/auth/logout"),
};
