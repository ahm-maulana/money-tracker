import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../api";

export default function useDeleteCategory() {
  const queryClient = useQueryClient();

  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await categoriesApi.delete(categoryId);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    deleteCategory: deleteCategory.mutateAsync,
    isPending: deleteCategory.isPending,
    error: deleteCategory.error,
  };
}
