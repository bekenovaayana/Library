"use client";

import { useQuery } from "@tanstack/react-query";
import { borrowApi } from "@/features/borrow/api/borrowApi";
import { borrowKeys } from "@/features/borrow/hooks/query-keys";

export function useMyBorrows() {
  return useQuery({
    queryKey: borrowKeys.my(),
    queryFn: borrowApi.getMyBorrows,
    staleTime: 30 * 1000,
    meta: { silent: true },
  });
}
