"use client";

import { BookPagination } from "@/features/books/components/book-pagination";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  itemLabel?: string;
}

export function DataTablePagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
  disabled,
  itemLabel = "items",
}: DataTablePaginationProps) {
  return (
    <BookPagination
      page={page}
      totalPages={totalPages}
      totalElements={totalElements}
      onPageChange={onPageChange}
      disabled={disabled}
      className="[&_p]:first:capitalize"
    />
  );
}
