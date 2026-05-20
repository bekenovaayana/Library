"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api/adminApi";
import { adminKeys } from "@/features/admin/hooks/query-keys";
import { useAuthStore } from "@/store/authStore";

const ACTIVITY_QUERY = {
  page: 0,
  size: 8,
  sort: "borrowDate,desc",
  status: "ACTIVE" as const,
};

export function useAdminActivity() {
  const role = useAuthStore((state) => state.user?.role);

  return useQuery({
    queryKey: adminKeys.activity(),
    queryFn: () => adminApi.getBorrowRecords(ACTIVITY_QUERY),
    enabled: role === "ADMIN",
    staleTime: 30 * 1000,
  });
}
