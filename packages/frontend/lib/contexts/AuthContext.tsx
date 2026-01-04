"use client";

import { authApi } from "@/features/auth/api";
import { User } from "@/features/auth/types";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  checkAuth: () => Promise<void>;
  clearAuth: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useCallback((userData: User, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
  }, []);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authApi.refresh();

      if (!response.success) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error("No data received from server");
      }

      setUser(response.data.user);
      setToken(response.data.token);
    } catch (error) {
      setUser(null);
      setToken(null);
      await authApi.logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setAuth,
        checkAuth,
        clearAuth,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
