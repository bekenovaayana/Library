"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { booksApi } from "@/features/books/api/booksApi";
import { bookKeys } from "@/features/books/hooks/book-keys";
import { adminKeys } from "@/features/admin/hooks/query-keys";
import { updateBooksListCache } from "@/features/admin/books/hooks/update-books-cache";
import type { Book } from "@/features/books/types/book";
import type { PaginatedResponse } from "@/shared/types/api";
import { getApiErrorMessage } from "@/services/api/apiClient";

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: booksApi.deleteBook,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: bookKeys.all });

      const snapshots = queryClient.getQueriesData<PaginatedResponse<Book>>({
        queryKey: bookKeys.all,
      });

      updateBooksListCache(queryClient, (old) => ({
        ...old,
        content: old.content.filter((book) => book.id !== id),
        totalElements: Math.max(0, old.totalElements - 1),
      }));

      return { snapshots };
    },
    onSuccess: () => {
      toast.success("Book deleted successfully");
      void queryClient.invalidateQueries({ queryKey: bookKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.statistics() });
    },
    onError: (error, _id, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(getApiErrorMessage(error));
    },
  });
}
