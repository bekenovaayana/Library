"use client";

import { BookMarked, RefreshCw } from "lucide-react";
import { useMyBorrows } from "@/features/borrow/hooks/useMyBorrows";
import { BorrowedBooksTable } from "@/features/borrow/components/borrowed-books-table";
import { BorrowHistoryCard } from "@/features/borrow/components/borrow-history-card";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { TableSkeleton } from "@/shared/components/loading-skeleton";
import { Spinner } from "@/shared/components/spinner";
import { Button } from "@/shared/ui/button";
import { getApiErrorMessage } from "@/services/api/apiClient";

export function MyBooksPageContent() {
  const { data, isLoading, isFetching, isError, error, refetch } = useMyBorrows();

  const records = data ?? [];
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

      {!isError && !isLoading && records.length === 0 && (
        <EmptyState
          title="No borrowed books yet"
          description="Browse the catalog and borrow your first book."
          action={<BookMarked className="mx-auto h-6 w-6 text-muted-foreground" />}
        />
      )}

      {!isError && !isLoading && activeBorrows.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Currently borrowed ({activeBorrows.length})
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
          <h2 className="text-xl font-semibold">Borrow history ({returnedBorrows.length})</h2>
          <div className="hidden lg:block">
            <BorrowedBooksTable records={returnedBorrows} showActions={false} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {returnedBorrows.map((record) => (
              <BorrowHistoryCard key={record.borrowId} record={record} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
