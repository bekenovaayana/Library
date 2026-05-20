"use client";

import { useState } from "react";
import { BookMarked, RefreshCw } from "lucide-react";
import { useMyBorrows } from "@/features/borrow/hooks/useMyBorrows";
import { BorrowedBooksTable } from "@/features/borrow/components/borrowed-books-table";
import { BorrowHistoryCard } from "@/features/borrow/components/borrow-history-card";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { DataTablePagination } from "@/shared/components/data-table";
import { TableSkeleton } from "@/shared/components/loading-skeleton";
import { Spinner } from "@/shared/components/spinner";
import { Button } from "@/shared/ui/button";
import { getApiErrorMessage } from "@/services/api/apiClient";

const PAGE_SIZE = 10;

export function MyBooksPageContent() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isFetching, isError, error, refetch } = useMyBorrows({
    page,
    size: PAGE_SIZE,
    sort: "borrowDate,desc",
  });

  const records = data?.content ?? [];
  const activeBorrows = records.filter((r) => r.status === "ACTIVE");
  const returnedBorrows = records.filter((r) => r.status === "RETURNED");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
          <p className="text-muted-foreground">Books you have borrowed and your history</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="shrink-0"
        >
          {isFetching ? <Spinner size="sm" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {isError && (
        <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
      )}

      {!isError && isLoading && <TableSkeleton rows={5} />}

      {!isError && !isLoading && (data?.totalElements ?? 0) === 0 && (
        <EmptyState
          title="No borrowed books yet"
          description="Browse the catalog and borrow your first book."
          action={<BookMarked className="mx-auto h-6 w-6 text-muted-foreground" />}
        />
      )}

      {!isError && !isLoading && activeBorrows.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Currently borrowed ({activeBorrows.length} on this page)
          </h2>
          <div className="hidden md:block">
            <BorrowedBooksTable records={activeBorrows} />
          </div>
          <div className="grid gap-4 md:hidden">
            {activeBorrows.map((record) => (
              <BorrowHistoryCard key={record.borrowId} record={record} />
            ))}
          </div>
        </section>
      )}

      {!isError && !isLoading && returnedBorrows.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Returned</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {returnedBorrows.map((record) => (
              <BorrowHistoryCard key={record.borrowId} record={record} />
            ))}
          </div>
        </section>
      )}

      {!isError && !isLoading && (data?.totalElements ?? 0) > 0 && (
        <DataTablePagination
          page={page}
          totalPages={data?.totalPages ?? 0}
          totalElements={data?.totalElements ?? 0}
          onPageChange={setPage}
          disabled={isFetching}
          itemLabel="records"
        />
      )}
    </div>
  );
}
