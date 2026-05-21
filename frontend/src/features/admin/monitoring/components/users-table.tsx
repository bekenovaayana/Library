"use client";

import { Users } from "lucide-react";
import { RoleBadge } from "@/features/admin/monitoring/components/role-badge";
import { useUpdateUserRole } from "@/features/admin/monitoring/hooks/useUpdateUserRole";
import { DataTableShell, SortableHeader } from "@/shared/components/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";
import { Button } from "@/shared/ui/button";
import { useAuthStore } from "@/store/authStore";
import type { AdminUser } from "@/features/admin/monitoring/types/admin-user";
import type { SortDirection } from "@/shared/components/data-table/types";
import type { UserRole } from "@/shared/types/auth";
import { ru } from "@/shared/i18n";

interface UsersTableProps {
  users: AdminUser[];
  isLoading?: boolean;
  onSort: (field: string) => void;
  getSortDirection: (field: string) => SortDirection | null;
}

export function UsersTable({ users, isLoading, onSort, getSortDirection }: UsersTableProps) {
  const currentUsername = useAuthStore((s) => s.user?.username);
  const roleMutation = useUpdateUserRole();
  const isEmpty = !isLoading && users.length === 0;

  const handleRoleChange = (user: AdminUser, role: UserRole) => {
    if (user.username === currentUsername) return;
    roleMutation.mutate({ userId: user.id, role });
  };

  return (
    <DataTableShell
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyTitle={ru.admin.noUsers}
      emptyDescription={ru.admin.noUsersHint}
      emptyIcon={<Users className="mx-auto h-6 w-6 text-muted-foreground" />}
    >
      <div className="hidden overflow-x-auto sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader
                  label={ru.auth.username}
                  field="username"
                  direction={getSortDirection("username")}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>
                <SortableHeader
                  label={ru.auth.email}
                  field="email"
                  direction={getSortDirection("email")}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>{ru.admin.role}</TableHead>
              <TableHead className="text-right">{ru.borrow.tableActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isSelf = user.username === currentUsername;
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-right">
                    {isSelf ? (
                      <span className="text-xs text-muted-foreground">{ru.common.you}</span>
                    ) : user.role === "USER" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={roleMutation.isPending}
                        onClick={() => handleRoleChange(user, "ADMIN")}
                      >
                        {ru.admin.makeAdmin}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={roleMutation.isPending}
                        onClick={() => handleRoleChange(user, "USER")}
                      >
                        {ru.admin.makeUser}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y sm:hidden">
        {users.map((user) => {
          const isSelf = user.username === currentUsername;
          return (
            <div key={user.id} className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{user.username}</span>
                <RoleBadge role={user.role} />
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {!isSelf && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  disabled={roleMutation.isPending}
                  onClick={() =>
                    handleRoleChange(user, user.role === "USER" ? "ADMIN" : "USER")
                  }
                >
                  {user.role === "USER" ? ru.admin.makeAdmin : ru.admin.makeUser}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </DataTableShell>
  );
}
