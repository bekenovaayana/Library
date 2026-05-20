"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api/adminApi";
import { adminKeys } from "@/features/admin/hooks/query-keys";
import type { AdminUsersQueryParams } from "@/features/admin/monitoring/types/admin-user";
import { useAuthStore } from "@/store/authStore";

export function useAdminUsers(params: AdminUsersQueryParams) {
  const role = useAuthStore((state) => state.user?.role);

  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminApi.getUsers(params),
    enabled: role === "ADMIN",
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}
