"use client";

import { useState } from "react";
import { AdminLayout } from "@/features/admin/components/admin-layout";
import { BooksToolbar } from "@/features/admin/books/components/books-toolbar";
import { BooksTable } from "@/features/admin/books/components/books-table";
import { BookFormModal } from "@/features/admin/books/components/book-form-modal";
import { useAdminBooksFilters } from "@/features/admin/books/hooks/useAdminBooksFilters";
import { useBooks } from "@/features/books/hooks/useBooks";
import { BookPagination } from "@/features/books/components/book-pagination";
import { ErrorState } from "@/shared/components/error-state";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { ru } from "@/shared/i18n";

export function AdminBooksPageContent() {
  const [formOpen, setFormOpen] = useState(false);
  const filters = useAdminBooksFilters();
  const { data, isLoading, isFetching, isError, error, refetch } = useBooks(filters.queryParams);

  const books = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <AdminLayout
      title={ru.admin.bookManagement}
      description={ru.admin.bookManagementSubtitle}
      onRefresh={() => refetch()}
      isRefreshing={isFetching && !isLoading}
    >
      <div className="space-y-6">
        <BooksToolbar
          title={filters.title}
          author={filters.author}
          category={filters.category}
          status={filters.status}
          sort={filters.sort}
          onTitleChange={(value) => {
            filters.setTitle(value);
            filters.setPage(0);
          }}
          onAuthorChange={(value) => {
            filters.setAuthor(value);
            filters.setPage(0);
          }}
          onCategoryChange={(value) => {
            filters.setCategory(value);
            filters.setPage(0);
          }}
          onStatusChange={(value) => {
            filters.setStatus(value);
            filters.setPage(0);
          }}
          onSortChange={(value) => {
            filters.setSort(value);
            filters.setPage(0);
          }}
          onClearFilters={filters.clearFilters}
          onAddBook={() => setFormOpen(true)}
          hasActiveFilters={filters.hasActiveFilters}
          disabled={isLoading}
        />

        {isError && (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        )}

        {!isError && (
          <>
            <BooksTable
              books={books}
              onSort={filters.handleSortChange}
              getSortDirection={filters.getSortDirection}
              isLoading={isLoading}
            />

            <BookPagination
              page={filters.page}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={filters.setPage}
              disabled={isFetching}
            />
          </>
        )}
      </div>

      <BookFormModal open={formOpen} onOpenChange={setFormOpen} />
    </AdminLayout>
  );
}
