import type { BorrowRecordStatus } from "@/features/borrow/types/borrow";

export interface AdminBorrowRecord {
  borrowId: number;
  username: string;
  bookTitle: string;
  borrowDate: string;
  returnDate: string | null;
  status: BorrowRecordStatus;
}

export type BorrowStatusFilter = BorrowRecordStatus | "ALL";

export interface AdminBorrowRecordsQueryParams {
  page: number;
  size: number;
  sort: string;
  search?: string;
  status?: BorrowRecordStatus;
}
