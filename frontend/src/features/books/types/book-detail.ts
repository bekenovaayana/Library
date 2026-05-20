import type { Book, BookStatus } from "./book";

export interface BookBorrowInfo {
  borrowId: number;
  username: string;
  borrowDate: string;
}

export interface BookDetail extends Book {
  currentBorrow: BookBorrowInfo | null;
}

export function isBookDetail(book: Book | BookDetail): book is BookDetail {
  return "currentBorrow" in book;
}

export function getAvailabilityLabel(status: BookStatus): string {
  return status === "AVAILABLE" ? "Available to borrow" : "Currently borrowed";
}
