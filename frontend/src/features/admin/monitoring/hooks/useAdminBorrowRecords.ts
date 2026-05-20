"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api/adminApi";
import { adminKeys } from "@/features/admin/hooks/query-keys";
import type { AdminBorrowRecordsQueryParams } from "@/features/admin/monitoring/types/admin-borrow-record";
import { useAuthStore } from "@/store/authStore";

export function useAdminBorrowRecords(params: AdminBorrowRecordsQueryParams) {
  const role = useAuthStore((state) => state.user?.role);

  return useQuery({
    queryKey: adminKeys.borrowRecords(params),
    queryFn: () => adminApi.getBorrowRecords(params),
    enabled: role === "ADMIN",
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}
