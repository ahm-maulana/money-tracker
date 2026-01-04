import { apiClient } from "./client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>("/auth/login", credentials, {
      withCredentials: true,
    }),

  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  logout: () => apiClient.post<void>("/auth/logout"),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ access_token: string }>("/auth/refresh", {
      refresh_token: refreshToken,
    }),

  me: () => apiClient.get<User>("/auth/me"),
};
