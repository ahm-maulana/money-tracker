import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../api";

export function useCategories() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesApi.getAll();

      // ✅ Check if response is successful
      if (!response.success) {
        // Throw error - React Query will catch this and set error state
        throw new Error(response.message || "Failed to fetch categories");
      }

      // ✅ Check if data exists
      if (!response.data) {
        throw new Error("No categories data received");
      }

      return response.data;
    },
  });

  return {
    data,
    isLoading,
    isError,
  };
}
