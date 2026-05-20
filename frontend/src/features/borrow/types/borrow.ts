export type BorrowRecordStatus = "ACTIVE" | "RETURNED";

export interface BorrowRecord {
  borrowId: number;
  username: string;
  bookTitle: string;
  borrowDate: string;
  returnDate: string | null;
  status: BorrowRecordStatus;
}

export interface BorrowBookPayload {
  bookId: number;
}
