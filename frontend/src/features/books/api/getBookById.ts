import type { BookDetail } from "@/features/books/types/book-detail";
import { ServerApiError, serverFetch } from "@/shared/lib/server-api";

export async function getBookById(id: number): Promise<BookDetail | null> {
  try {
    return await serverFetch<BookDetail>(`/books/${id}`);
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
