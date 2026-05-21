"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { booksApi } from "@/features/books/api/booksApi";
import { bookKeys } from "@/features/books/hooks/book-keys";
import { adminKeys } from "@/features/admin/hooks/query-keys";
import { updateBooksListCache } from "@/features/admin/books/hooks/update-books-cache";
import type { Book, BookPayload } from "@/features/books/types/book";
import type { PaginatedResponse } from "@/shared/types/api";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { ru } from "@/shared/i18n";

interface UpdateBookVariables {
  id: number;
  payload: BookPayload;
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateBookVariables) => booksApi.updateBook(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: bookKeys.all });

      const snapshots = queryClient.getQueriesData<PaginatedResponse<Book>>({
        queryKey: bookKeys.all,
      });

      updateBooksListCache(queryClient, (old) => ({
        ...old,
        content: old.content.map((book) =>
          book.id === id ? { ...book, ...payload } : book,
        ),
      }));

      return { snapshots };
    },
    onSuccess: (data) => {
      toast.success(ru.admin.bookUpdated(data.title));
      void queryClient.invalidateQueries({ queryKey: bookKeys.all });
      void queryClient.invalidateQueries({ queryKey: bookKeys.detail(data.id) });
      void queryClient.invalidateQueries({ queryKey: adminKeys.statistics() });
    },
    onError: (error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(getApiErrorMessage(error));
    },
  });
}
