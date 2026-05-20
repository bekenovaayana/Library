import type { BooksQueryParams } from "@/features/books/types/book";

export const BOOKS_QUERY_KEY = "books";

export const bookKeys = {
  all: [BOOKS_QUERY_KEY] as const,
  list: (params: BooksQueryParams) => [...bookKeys.all, params] as const,
  detail: (id: number) => [...bookKeys.all, "detail", id] as const,
};
