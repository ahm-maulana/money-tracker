"use client";

import { useRouter } from "next/navigation";
import { RegisterInput } from "../validation";
import { useState } from "react";
import { authApi } from "../api";
import { getErrorMessage } from "@/lib/utils/error.util";

export function useRegister() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterInput) => {
    setError(null);

    try {
      await authApi.register(data);
      router.push("/login");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    }
  };
  return { register, error };
}
