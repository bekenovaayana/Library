"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { booksApi } from "@/features/books/api/booksApi";
import { bookKeys } from "@/features/books/hooks/book-keys";
import type { BooksQueryParams } from "@/features/books/types/book";

export { BOOKS_QUERY_KEY } from "@/features/books/hooks/book-keys";

export function useBooks(params: BooksQueryParams) {
  return useQuery({
    queryKey: bookKeys.list(params),
    queryFn: () => booksApi.getBooks(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    meta: { silent: true },
  });
}
