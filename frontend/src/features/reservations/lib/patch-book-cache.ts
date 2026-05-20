import type { Book } from "@/features/books/types/book";
import type { BookDetail } from "@/features/books/types/book-detail";
import type { PaginatedResponse } from "@/shared/types/api";

export function patchBookDetailCache(
  book: BookDetail | undefined,
  patch: Partial<BookDetail>,
): BookDetail | undefined {
  if (!book) return book;
  return { ...book, ...patch };
}

export function patchBookInCatalogCaches(
  data: PaginatedResponse<Book> | undefined,
  bookId: number,
  patch: Partial<Book>,
): PaginatedResponse<Book> | undefined {
  if (!data) return data;

  return {
    ...data,
    content: data.content.map((book) =>
      book.id === bookId ? { ...book, ...patch } : book,
    ),
  };
}
