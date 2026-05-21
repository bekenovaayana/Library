"use client";

import { formatBorrowDate } from "@/features/borrow/utils/format-date";
import { BorrowStatusBadge } from "@/features/borrow/components/borrow-status-badge";
import { ReturnButton } from "@/features/borrow/components/return-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";
import type { BorrowRecord } from "@/features/borrow/types/borrow";
import { ru } from "@/shared/i18n";

interface BorrowedBooksTableProps {
  records: BorrowRecord[];
  showActions?: boolean;
}

export function BorrowedBooksTable({ records, showActions = true }: BorrowedBooksTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ru.borrow.tableBook}</TableHead>
            <TableHead>{ru.borrow.tableBorrowed}</TableHead>
            <TableHead>{ru.borrow.tableDue}</TableHead>
            <TableHead>{ru.borrow.tableReturned}</TableHead>
            <TableHead>{ru.borrow.tableStatus}</TableHead>
            {showActions && <TableHead className="text-right">{ru.borrow.tableActions}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.borrowId}>
              <TableCell className="font-medium">{record.bookTitle}</TableCell>
              <TableCell>{formatBorrowDate(record.borrowDate)}</TableCell>
              <TableCell
                className={record.overdue ? "font-medium text-destructive" : undefined}
              >
                {record.dueDate ? formatBorrowDate(record.dueDate) : "—"}
              </TableCell>
              <TableCell>{formatBorrowDate(record.returnDate)}</TableCell>
              <TableCell>
                <BorrowStatusBadge status={record.status} overdue={record.overdue} />
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  {record.status === "ACTIVE" ? (
                    <ReturnButton borrowId={record.borrowId} bookTitle={record.bookTitle} />
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
