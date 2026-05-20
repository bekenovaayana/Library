import { apiClient } from "@/services/api";
import type { PaginatedResponse } from "@/shared/types/api";
import type { BorrowBookPayload, BorrowRecord, MyBorrowsQueryParams } from "@/features/borrow/types/borrow";

export const borrowApi = {
  getMyBorrows: async (params: MyBorrowsQueryParams): Promise<PaginatedResponse<BorrowRecord>> => {
    const { data } = await apiClient.get<PaginatedResponse<BorrowRecord>>("/borrow/my", {
      params: {
        page: params.page,
        size: params.size,
        ...(params.sort ? { sort: params.sort } : {}),
      },
    });
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
