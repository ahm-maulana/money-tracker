"use client";

import { useState } from "react";
import { authApi } from "../api";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const { clearAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);

    try {
      await authApi.logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      clearAuth();
      setIsLoading(false);
      router.push("/login");
    }
  };

  return { logout, isLoading };
}
