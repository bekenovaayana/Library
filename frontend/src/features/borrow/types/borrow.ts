export type BorrowRecordStatus = "ACTIVE" | "RETURNED";

export interface BorrowRecord {
  borrowId: number;
  bookId: number;
  username: string;
  bookTitle: string;
  coverUrl?: string | null;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  fineAmount: number;
  overdue: boolean;
  status: BorrowRecordStatus;
}

export interface BorrowBookPayload {
  bookId: number;
}

export interface MyBorrowsQueryParams {
  page: number;
  size: number;
  sort?: string;
}
