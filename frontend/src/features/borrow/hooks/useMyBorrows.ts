"use client";

import { useQuery } from "@tanstack/react-query";
import { borrowApi } from "@/features/borrow/api/borrowApi";
import { borrowKeys } from "@/features/borrow/hooks/query-keys";
import type { MyBorrowsQueryParams } from "@/features/borrow/types/borrow";

export function useMyBorrows(params: MyBorrowsQueryParams) {
  return useQuery({
    queryKey: borrowKeys.my(params),
    queryFn: () => borrowApi.getMyBorrows(params),
    staleTime: 30 * 1000,
    meta: { silent: true },
  });
}
