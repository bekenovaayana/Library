"use client";

import { Activity } from "lucide-react";
import { BorrowStatusBadge } from "@/features/borrow/components/borrow-status-badge";
import { formatBorrowDate } from "@/features/borrow/utils/format-date";
import { DataTableShell } from "@/shared/components/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";
import type { AdminBorrowRecord } from "@/features/admin/monitoring/types/admin-borrow-record";

interface ActivityTableProps {
  records: AdminBorrowRecord[];
  isLoading?: boolean;
}

export function ActivityTable({ records, isLoading }: ActivityTableProps) {
  const isEmpty = !isLoading && records.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-semibold">Live activity</h2>
        <span className="text-sm text-muted-foreground">Currently borrowed books</span>
      </div>

      <DataTableShell
        isLoading={isLoading}
        isEmpty={isEmpty}
        emptyTitle="No active borrows"
        emptyDescription="All books are currently available in the library."
        emptyIcon={<Activity className="mx-auto h-6 w-6 text-muted-foreground" />}
      >
        <div className="hidden overflow-x-auto sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Since</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.borrowId}>
                  <TableCell className="font-medium">{record.username}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{record.bookTitle}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatBorrowDate(record.borrowDate)}
                  </TableCell>
                  <TableCell>
                    <BorrowStatusBadge status={record.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="divide-y sm:hidden">
          {records.map((record) => (
            <div key={record.borrowId} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{record.bookTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {record.username} · {formatBorrowDate(record.borrowDate)}
                </p>
              </div>
              <BorrowStatusBadge status={record.status} />
            </div>
          ))}
        </div>
      </DataTableShell>
    </div>
  );
}
