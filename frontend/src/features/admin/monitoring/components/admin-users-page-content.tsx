"use client";

import { useMemo, useState } from "react";
import { AdminLayout } from "@/features/admin/components/admin-layout";
import { UsersTable } from "@/features/admin/monitoring/components/users-table";
import { useAdminUsers } from "@/features/admin/monitoring/hooks/useAdminUsers";
import {
  DataTablePagination,
  DataTableToolbar,
  FilterField,
} from "@/shared/components/data-table";
import { FormSelect } from "@/shared/components/form";
import { usePaginatedTableState } from "@/shared/hooks/use-paginated-table-state";
import { ErrorState } from "@/shared/components/error-state";
import { getApiErrorMessage } from "@/services/api/apiClient";
import type { UserRoleFilter } from "@/features/admin/monitoring/types/admin-user";
import type { UserRole } from "@/shared/types/auth";

export function AdminUsersPageContent() {
  const table = usePaginatedTableState({ defaultSort: "username,asc" });
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("ALL");

  const queryParams = useMemo(
    () => ({
      page: table.page,
      size: table.size,
      sort: table.sort,
      ...(table.debouncedSearch && { search: table.debouncedSearch }),
      ...(roleFilter !== "ALL" && { role: roleFilter as UserRole }),
    }),
    [table.page, table.size, table.sort, table.debouncedSearch, roleFilter],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useAdminUsers(queryParams);

  const users = data?.content ?? [];
  const hasActiveFilters = Boolean(table.search || roleFilter !== "ALL");

  const handleClear = () => {
    table.setSearch("");
    setRoleFilter("ALL");
    table.resetPage();
  };

  return (
    <AdminLayout
      title="User Monitoring"
      description="View registered users and their roles"
      onRefresh={() => refetch()}
      isRefreshing={isFetching && !isLoading}
    >
      <div className="space-y-6">
        <DataTableToolbar
          search={table.search}
          onSearchChange={(value) => {
            table.setSearch(value);
            table.resetPage();
          }}
          searchPlaceholder="Search username or email..."
          hasActiveFilters={hasActiveFilters}
          onClear={handleClear}
          disabled={isLoading}
          filters={
            <FilterField id="role-filter" label="Role">
              <FormSelect
                id="role-filter"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as UserRoleFilter);
                  table.resetPage();
                }}
                disabled={isLoading}
                options={[
                  { value: "ALL", label: "All roles" },
                  { value: "USER", label: "User" },
                  { value: "ADMIN", label: "Admin" },
                ]}
              />
            </FilterField>
          }
        />

        {isError && (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        )}

        {!isError && (
          <>
            <UsersTable
              users={users}
              isLoading={isLoading}
              onSort={table.handleSortChange}
              getSortDirection={table.getSortDirection}
            />

            <DataTablePagination
              page={table.page}
              totalPages={data?.totalPages ?? 0}
              totalElements={data?.totalElements ?? 0}
              onPageChange={table.setPage}
              disabled={isFetching}
              itemLabel="users"
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
