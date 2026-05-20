"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface BookPaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const pages: (number | "ellipsis")[] = [0];

  if (current > 2) {
    pages.push("ellipsis");
  }

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push("ellipsis");
  }

  if (total > 1) {
    pages.push(total - 1);
  }

  return pages;
}

export function BookPagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
  disabled = false,
  className,
}: BookPaginationProps) {
  if (totalPages <= 1) {
    return (
      <p className={cn("text-center text-sm text-muted-foreground", className)}>
        Showing {totalElements} {totalElements === 1 ? "book" : "books"}
      </p>
    );
  }

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-center text-sm text-muted-foreground sm:text-left">
        <span className="font-medium text-foreground">
          Page {page + 1} of {totalPages}
        </span>
        <span className="hidden sm:inline"> · </span>
        <span className="block sm:inline">
          {totalElements} {totalElements === 1 ? "book" : "books"} total
        </span>
      </p>

      <nav
        className="flex items-center justify-center gap-1 sm:justify-end"
        aria-label="Pagination"
      >
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page === 0}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="min-w-[4.5rem] px-2 text-center text-sm font-medium sm:hidden">
          {page + 1} / {totalPages}
        </span>

        <div className="hidden items-center gap-1 sm:flex">
          {pageNumbers.map((pageNum, index) =>
            pageNum === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-1 text-muted-foreground">
                …
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
                onClick={() => onPageChange(pageNum)}
                disabled={disabled}
                aria-label={`Page ${pageNum + 1}`}
                aria-current={pageNum === page ? "page" : undefined}
              >
                {pageNum + 1}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages - 1}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}
