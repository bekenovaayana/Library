"use client";

import { BookOpen, RefreshCw } from "lucide-react";
import { useBooks } from "@/features/books/hooks/useBooks";
import { useBooksFilters } from "@/features/books/hooks/useBooksFilters";
import { BookGrid } from "@/features/books/components/book-grid";
import { BooksCatalogToolbar } from "@/features/books/components/books-catalog-toolbar";
import { BookPagination } from "@/features/books/components/book-pagination";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { Spinner } from "@/shared/components/spinner";
import { Button } from "@/shared/ui/button";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { pluralBooks, ru } from "@/shared/i18n";

export function BooksPageContent() {
  const filters = useBooksFilters();
  const { data, isLoading, isFetching, isError, error, refetch, isPlaceholderData } =
    useBooks(filters.queryParams);

  const books = data?.content ?? [];
  const isInitialLoading = isLoading && !isPlaceholderData;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{ru.books.title}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{ru.books.subtitle}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-full shrink-0 sm:w-auto"
        >
          {isFetching ? (
            <Spinner size="sm" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {ru.common.refresh}
        </Button>
      </header>

      <BooksCatalogToolbar
        query={filters.queryInput}
        category={filters.category}
        status={filters.status}
        sort={filters.sort}
        hasActiveFilters={filters.hasActiveFilters}
        disabled={isInitialLoading}
        onQueryChange={filters.handleQueryChange}
        onCategoryChange={filters.handleCategoryChange}
        onStatusChange={filters.handleStatusChange}
        onSortChange={filters.handleSortChange}
        onClear={filters.clearFilters}
      />

      {!isError && !isInitialLoading && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {totalElements === 0
            ? ru.books.noMatch
            : ru.books.inCatalog(totalElements, pluralBooks(totalElements))}
          {filters.hasActiveFilters ? ru.books.filtersApplied : ""}
        </p>
      )}

      {isFetching && !isInitialLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner size="sm" />
          {ru.books.updating}
        </div>
      )}

      {isError && (
        <ErrorState
          error={error}
          message={getApiErrorMessage(error)}
          onRetry={() => refetch()}
        />
      )}

      {!isError && (
        <>
          <BookGrid
            books={books}
            isLoading={isInitialLoading}
            isFetching={isFetching && isPlaceholderData}
          />

          {!isInitialLoading && books.length === 0 && (
            <EmptyState
              title={ru.books.notFound}
              description={
                filters.hasActiveFilters ? ru.books.notFoundHint : ru.books.emptyCatalog
              }
              action={<BookOpen className="mx-auto h-6 w-6 text-muted-foreground" />}
            />
          )}

          {!isInitialLoading && books.length > 0 && data && (
            <BookPagination
              page={data.number}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              onPageChange={filters.handlePageChange}
              disabled={isFetching}
            />
          )}
        </>
      )}
    </div>
  );
}
