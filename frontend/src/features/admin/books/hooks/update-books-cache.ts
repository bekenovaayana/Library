import type { QueryClient } from "@tanstack/react-query";
import { bookKeys } from "@/features/books/hooks/book-keys";
import type { Book } from "@/features/books/types/book";
import type { PaginatedResponse } from "@/shared/types/api";

export function updateBooksListCache(
  queryClient: QueryClient,
  updater: (data: PaginatedResponse<Book>) => PaginatedResponse<Book>,
) {
  queryClient.setQueriesData<PaginatedResponse<Book>>({ queryKey: bookKeys.all }, (old) =>
    old ? updater(old) : old,
  );
}
