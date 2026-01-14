import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCategoryInput } from "../validation";
import { categoriesApi } from "../api";

export default function useUpdateCategory() {
  const queryClient = useQueryClient();

  const updateCategory = useMutation({
    mutationFn: async (data: UpdateCategoryInput & { id: string }) => {
      const { id, ...updatedData } = data;

      const response = await categoriesApi.update(id, updatedData);

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
    updateCategory: updateCategory.mutateAsync,
    isPending: updateCategory.isPending,
    error: updateCategory.error,
  };
}
