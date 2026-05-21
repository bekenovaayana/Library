"use client";

import { BookMarked } from "lucide-react";
import { BorrowStatusBadge } from "@/features/borrow/components/borrow-status-badge";
import { formatBorrowDate } from "@/features/borrow/utils/format-date";
import { DataTableShell, SortableHeader } from "@/shared/components/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";
import type { AdminBorrowRecord } from "@/features/admin/monitoring/types/admin-borrow-record";
import type { SortDirection } from "@/shared/components/data-table/types";
import { ru } from "@/shared/i18n";

interface BorrowRecordsTableProps {
  records: AdminBorrowRecord[];
  isLoading?: boolean;
  onSort: (field: string) => void;
  getSortDirection: (field: string) => SortDirection | null;
}

export function BorrowRecordsTable({
  records,
  isLoading,
  onSort,
  getSortDirection,
}: BorrowRecordsTableProps) {
  const isEmpty = !isLoading && records.length === 0;

  return (
    <DataTableShell
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyTitle={ru.admin.noBorrowRecords}
      emptyDescription={ru.admin.noRecordsMatch}
      emptyIcon={<BookMarked className="mx-auto h-6 w-6 text-muted-foreground" />}
    >
      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{ru.auth.username}</TableHead>
              <TableHead>{ru.borrow.tableBook}</TableHead>
              <TableHead>
                <SortableHeader
                  label={ru.borrow.tableBorrowed}
                  field="borrowDate"
                  direction={getSortDirection("borrowDate")}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>{ru.borrow.tableReturned}</TableHead>
              <TableHead>{ru.borrow.tableStatus}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.borrowId}>
                <TableCell className="font-medium">{record.username}</TableCell>
                <TableCell className="max-w-[200px] truncate">{record.bookTitle}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatBorrowDate(record.borrowDate)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatBorrowDate(record.returnDate)}
                </TableCell>
                <TableCell>
                  <BorrowStatusBadge status={record.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y md:hidden">
        {records.map((record) => (
          <div key={record.borrowId} className="space-y-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{record.bookTitle}</span>
              <BorrowStatusBadge status={record.status} />
            </div>
            <p className="text-sm text-muted-foreground">{record.username}</p>
            <p className="text-xs text-muted-foreground">
              {ru.borrow.borrowedOn} {formatBorrowDate(record.borrowDate)}
              {record.returnDate
                ? ` · ${ru.borrow.returnedOn} ${formatBorrowDate(record.returnDate)}`
                : ""}
            </p>
          </div>
        ))}
      </div>
    </DataTableShell>
  );
}
