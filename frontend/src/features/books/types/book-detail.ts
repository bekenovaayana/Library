import type { Book, BookStatus } from "./book";

export interface BookBorrowInfo {
  borrowId: number;
  username: string;
  borrowDate: string;
  dueDate?: string;
}

export interface BookDetail extends Book {
  currentBorrow: BookBorrowInfo | null;
  reservationQueueSize: number;
  userHasReservation: boolean;
  borrowDays: number;
  finePerDay: number;
  maxFine: number;
  estimatedDueDate?: string | null;
}

export function isBookDetail(book: Book | BookDetail): book is BookDetail {
  return "currentBorrow" in book;
}

export function getAvailabilityLabel(status: BookStatus): string {
  return status === "AVAILABLE" ? "Available to borrow" : "Currently borrowed";
}
