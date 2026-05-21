"use client";

import { useMemo, useState } from "react";
import { AdminLayout } from "@/features/admin/components/admin-layout";
import { ActivityTable } from "@/features/admin/monitoring/components/activity-table";
import { BorrowRecordsTable } from "@/features/admin/monitoring/components/borrow-records-table";
import { useAdminActivity } from "@/features/admin/monitoring/hooks/useAdminActivity";
import { useAdminBorrowRecords } from "@/features/admin/monitoring/hooks/useAdminBorrowRecords";
import {
  DataTablePagination,
  DataTableToolbar,
  FilterField,
} from "@/shared/components/data-table";
import { FormSelect } from "@/shared/components/form";
import { usePaginatedTableState } from "@/shared/hooks/use-paginated-table-state";
import { ErrorState } from "@/shared/components/error-state";
import { getApiErrorMessage } from "@/services/api/apiClient";
import type { BorrowStatusFilter } from "@/features/admin/monitoring/types/admin-borrow-record";
import type { BorrowRecordStatus } from "@/features/borrow/types/borrow";
import { borrowStatusLabel, ru } from "@/shared/i18n";

export function AdminBorrowedBooksPageContent() {
  const table = usePaginatedTableState({ defaultSort: "borrowDate,desc" });
  const [statusFilter, setStatusFilter] = useState<BorrowStatusFilter>("ALL");

  const queryParams = useMemo(
    () => ({
      page: table.page,
      size: table.size,
      sort: table.sort,
      ...(table.debouncedSearch && { search: table.debouncedSearch }),
      ...(statusFilter !== "ALL" && { status: statusFilter as BorrowRecordStatus }),
    }),
    [table.page, table.size, table.sort, table.debouncedSearch, statusFilter],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminBorrowRecords(queryParams);
  const activityQuery = useAdminActivity();

  const records = data?.content ?? [];
  const activityRecords = activityQuery.data?.content ?? [];
  const hasActiveFilters = Boolean(table.search || statusFilter !== "ALL");

  const handleClear = () => {
    table.setSearch("");
    setStatusFilter("ALL");
    table.resetPage();
  };

  return (
    <AdminLayout
      title={ru.admin.borrowMonitoring}
      description={ru.admin.borrowMonitoringSubtitle}
      onRefresh={() => {
        void refetch();
        void activityQuery.refetch();
      }}
      isRefreshing={(isFetching && !isLoading) || activityQuery.isFetching}
    >
      <div className="space-y-8">
        <ActivityTable records={activityRecords} isLoading={activityQuery.isLoading} />

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">{ru.admin.allRecords}</h2>

          <DataTableToolbar
            search={table.search}
            onSearchChange={(value) => {
              table.setSearch(value);
              table.resetPage();
            }}
            searchPlaceholder={ru.admin.searchUserOrBook}
            hasActiveFilters={hasActiveFilters}
            onClear={handleClear}
            disabled={isLoading}
            filters={
              <FilterField id="status-filter" label={ru.books.status}>
                <FormSelect
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as BorrowStatusFilter);
                    table.resetPage();
                  }}
                  disabled={isLoading}
                  options={[
                    { value: "ALL", label: ru.admin.allStatuses },
                    { value: "ACTIVE", label: borrowStatusLabel("ACTIVE") },
                    { value: "RETURNED", label: borrowStatusLabel("RETURNED") },
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
              <BorrowRecordsTable
                records={records}
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
                itemLabel="records"
              />
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
