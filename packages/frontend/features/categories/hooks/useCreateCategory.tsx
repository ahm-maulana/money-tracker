import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryInput } from "../validation";
import { categoriesApi } from "../api";

export default function useCreateCategory() {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const response = await categoriesApi.create(data);

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
    createCategory: createCategory.mutateAsync,
    isPending: createCategory.isPending,
    error: createCategory.error,
  };
}
