import { apiClient } from "@/services/api";
import type { AdminStatistics } from "@/features/admin/types/admin-statistics";
import type { AdminUser, AdminUsersQueryParams } from "@/features/admin/monitoring/types/admin-user";
import type {
  AdminBorrowRecord,
  AdminBorrowRecordsQueryParams,
} from "@/features/admin/monitoring/types/admin-borrow-record";
import type { PaginatedResponse } from "@/shared/types/api";
import type { UserRole } from "@/shared/types/auth";

function buildAdminPageParams(
  params: AdminUsersQueryParams | AdminBorrowRecordsQueryParams,
): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page,
    size: params.size,
    sort: params.sort,
  };

  if (params.search) query.search = params.search;
  if ("role" in params && params.role) query.role = params.role;
  if ("status" in params && params.status) query.status = params.status;

  return query;
}

export const adminApi = {
  getStatistics: async (): Promise<AdminStatistics> => {
    const { data } = await apiClient.get<AdminStatistics>("/admin/statistics");
    return data;
  },

  getUsers: async (params: AdminUsersQueryParams): Promise<PaginatedResponse<AdminUser>> => {
    const { data } = await apiClient.get<PaginatedResponse<AdminUser>>("/admin/users", {
      params: buildAdminPageParams(params),
    });
    return data;
  },

  getBorrowRecords: async (
    params: AdminBorrowRecordsQueryParams,
  ): Promise<PaginatedResponse<AdminBorrowRecord>> => {
    const { data } = await apiClient.get<PaginatedResponse<AdminBorrowRecord>>(
      "/admin/borrowed-books",
      { params: buildAdminPageParams(params) },
    );
    return data;
  },

  updateUserRole: async (userId: number, role: UserRole): Promise<AdminUser> => {
    const { data } = await apiClient.patch<AdminUser>(`/admin/users/${userId}/role`, { role });
    return data;
  },
};
