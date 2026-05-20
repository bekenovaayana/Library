import { apiClient } from "@/services/api";
import type { PaginatedResponse } from "@/shared/types/api";
import { buildPageParams, hasActiveFilters } from "@/features/books/lib/books-query";
import type { BookDetail } from "@/features/books/types/book-detail";
import type { Book, BookPayload, BooksQueryParams } from "@/features/books/types/book";

export const booksApi = {
  getBooks: async (params: BooksQueryParams): Promise<PaginatedResponse<Book>> => {
    const endpoint = hasActiveFilters(params) ? "/books/search" : "/books";
    const { data } = await apiClient.get<PaginatedResponse<Book>>(endpoint, {
      params: buildPageParams(params),
    });
    return data;
  },

  getBookById: async (id: number): Promise<BookDetail> => {
    const { data } = await apiClient.get<BookDetail>(`/books/${id}`);
    return data;
  },

  createBook: async (payload: BookPayload): Promise<Book> => {
    const { data } = await apiClient.post<Book>("/books", payload);
    return data;
  },

  updateBook: async (id: number, payload: BookPayload): Promise<Book> => {
    const { data } = await apiClient.put<Book>(`/books/${id}`, payload);
    return data;
  },

  deleteBook: async (id: number): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
  },
};
