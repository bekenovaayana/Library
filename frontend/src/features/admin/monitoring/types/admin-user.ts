import type { UserRole } from "@/shared/types/auth";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export type UserRoleFilter = UserRole | "ALL";

export interface AdminUsersQueryParams {
  page: number;
  size: number;
  sort: string;
  search?: string;
  role?: UserRole;
}
