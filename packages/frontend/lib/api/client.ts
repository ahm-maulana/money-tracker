import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_CONFIG } from "./config";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
      withCredentials: API_CONFIG.withCredentials,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const isLoginRequest = error.config?.url?.includes("/auth/login");
        const isRefreshRequest = error.config?.url?.includes("/auth/refresh");

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          if (isLoginRequest || isRefreshRequest) {
            return Promise.reject(error);
          }

          if (typeof window !== "undefined") {
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
              try {
                // Try to refresh the token
                const response = await axios.post(
                  `${API_CONFIG.baseURL}/auth/refresh`,
                  { refresh_token: refreshToken }
                );

                const { access_token } = response.data;
                localStorage.setItem("access_token", access_token);

                // Retry the original request with new token
                if (error.config?.headers) {
                  error.config.headers.Authorization = `Bearer ${access_token}`;
                }
                return this.client.request(error.config!);
              } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
              }
            } else {
              // No refresh token, redirect to login
              window.location.href = "/login";
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // HTTP Methods
  async get<T>(url: string, config = {}) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config = {}) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config = {}) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config = {}) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config = {}) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Get the raw axios instance if needed
  getInstance() {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
