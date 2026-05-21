"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { booksApi } from "@/features/books/api/booksApi";
import { bookKeys } from "@/features/books/hooks/book-keys";
import { adminKeys } from "@/features/admin/hooks/query-keys";
import { updateBooksListCache } from "@/features/admin/books/hooks/update-books-cache";
import type { Book, BookPayload } from "@/features/books/types/book";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { ru } from "@/shared/i18n";

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: booksApi.createBook,
    onMutate: async (payload: BookPayload) => {
      await queryClient.cancelQueries({ queryKey: bookKeys.all });

      const optimisticBook: Book = {
        id: -Date.now(),
        ...payload,
        status: "AVAILABLE",
      };

      updateBooksListCache(queryClient, (old) => ({
        ...old,
        content: [optimisticBook, ...old.content],
        totalElements: old.totalElements + 1,
      }));

      return { optimisticBook };
    },
    onSuccess: (data) => {
      toast.success(ru.admin.bookAdded(data.title));
      void queryClient.invalidateQueries({ queryKey: bookKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.statistics() });
    },
    onError: (error) => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.all });
      toast.error(getApiErrorMessage(error));
    },
  });
}
