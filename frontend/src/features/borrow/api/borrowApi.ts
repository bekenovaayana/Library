import { apiClient } from "@/services/api";
import type { BorrowBookPayload, BorrowRecord } from "@/features/borrow/types/borrow";

export const borrowApi = {
  getMyBorrows: async (): Promise<BorrowRecord[]> => {
    const { data } = await apiClient.get<BorrowRecord[]>("/borrow/my");
    return data;
  },

  borrowBook: async (payload: BorrowBookPayload): Promise<BorrowRecord> => {
    const { data } = await apiClient.post<BorrowRecord>("/borrow", payload);
    return data;
  },

  returnBook: async (borrowId: number): Promise<BorrowRecord> => {
    const { data } = await apiClient.post<BorrowRecord>(`/return/${borrowId}`);
    return data;
  },
};
