"use client";

import { Users } from "lucide-react";
import { RoleBadge } from "@/features/admin/monitoring/components/role-badge";
import { DataTableShell, SortableHeader } from "@/shared/components/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";
import type { AdminUser } from "@/features/admin/monitoring/types/admin-user";
import type { SortDirection } from "@/shared/components/data-table/types";

interface UsersTableProps {
  users: AdminUser[];
  isLoading?: boolean;
  onSort: (field: string) => void;
  getSortDirection: (field: string) => SortDirection | null;
}

export function UsersTable({ users, isLoading, onSort, getSortDirection }: UsersTableProps) {
  const isEmpty = !isLoading && users.length === 0;

  return (
    <DataTableShell
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyTitle="No users found"
      emptyDescription="Try a different search term or clear your filters."
      emptyIcon={<Users className="mx-auto h-6 w-6 text-muted-foreground" />}
    >
      <div className="hidden overflow-x-auto sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader
                  label="Username"
                  field="username"
                  direction={getSortDirection("username")}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>
                <SortableHeader
                  label="Email"
                  field="email"
                  direction={getSortDirection("email")}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y sm:hidden">
        {users.map((user) => (
          <div key={user.id} className="space-y-1 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{user.username}</span>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        ))}
      </div>
    </DataTableShell>
  );
}
