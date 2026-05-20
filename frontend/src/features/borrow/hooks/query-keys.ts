import type { MyBorrowsQueryParams } from "@/features/borrow/types/borrow";

export const borrowKeys = {
  all: ["borrow"] as const,
  my: (params?: MyBorrowsQueryParams) => [...borrowKeys.all, "my", params] as const,
};
