"use client";

import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/features/books/api/booksApi";
import { bookKeys } from "@/features/books/hooks/book-keys";
import type { BookDetail } from "@/features/books/types/book-detail";

export function useBookDetail(id: number, initialData?: BookDetail) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => booksApi.getBookById(id),
    initialData,
    staleTime: 60 * 1000,
  });
}
