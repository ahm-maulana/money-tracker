"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginInput } from "../validation";
import { authApi } from "../api";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getErrorMessage } from "@/lib/utils/error.util";

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginInput) => {
    setError(null);

    try {
      const response = await authApi.login(data);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("No data received from server");
      }

      setAuth(response.data.user, response.data.token);

      const returnUrl =
        new URLSearchParams(window.location.search).get("returnUrl") ||
        "/dashboard";

      router.push(returnUrl);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    }
  };

  return { login, error };
}
