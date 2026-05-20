import type { AdminBorrowRecordsQueryParams } from "@/features/admin/monitoring/types/admin-borrow-record";
import type { AdminUsersQueryParams } from "@/features/admin/monitoring/types/admin-user";

export const adminKeys = {
  all: ["admin"] as const,
  statistics: () => [...adminKeys.all, "statistics"] as const,
  users: (params: AdminUsersQueryParams) => [...adminKeys.all, "users", params] as const,
  borrowRecords: (params: AdminBorrowRecordsQueryParams) =>
    [...adminKeys.all, "borrow-records", params] as const,
  activity: () => [...adminKeys.all, "activity"] as const,
};
