import { AlertTriangle, Calendar, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatBorrowDate } from "@/features/borrow/utils/format-date";
import { formatMoney } from "@/features/borrow/utils/format-money";
import { BorrowStatusBadge } from "@/features/borrow/components/borrow-status-badge";
import { ReturnButton } from "@/features/borrow/components/return-button";
import type { BorrowRecord } from "@/features/borrow/types/borrow";
import { ru } from "@/shared/i18n";

interface BorrowHistoryCardProps {
  record: BorrowRecord;
}

export function BorrowHistoryCard({ record }: BorrowHistoryCardProps) {
  return (
    <Card className={record.overdue ? "border-destructive/40" : undefined}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
        <CardTitle className="line-clamp-2 text-base leading-snug">{record.bookTitle}</CardTitle>
        <BorrowStatusBadge status={record.status} overdue={record.overdue} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>
            {ru.borrow.borrowedOn} {formatBorrowDate(record.borrowDate)}
          </span>
        </div>
        {record.status === "ACTIVE" && record.dueDate && (
          <div
            className={`flex items-center gap-2 text-sm ${record.overdue ? "font-medium text-destructive" : "text-muted-foreground"}`}
          >
            {record.overdue ? (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            ) : (
              <Calendar className="h-4 w-4 shrink-0" />
            )}
            <span>
              {ru.borrow.dueOn} {formatBorrowDate(record.dueDate)}
            </span>
          </div>
        )}
        {record.returnDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              {ru.borrow.returnedOn} {formatBorrowDate(record.returnDate)}
            </span>
          </div>
        )}
        {record.fineAmount > 0 && (
          <p className="text-sm font-medium text-destructive">
            {ru.borrow.lateFeeAmount(formatMoney(record.fineAmount))}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Hash className="h-3.5 w-3.5" />
          {ru.borrow.recordId(record.borrowId)}
        </div>
        {record.status === "ACTIVE" && (
          <ReturnButton borrowId={record.borrowId} bookTitle={record.bookTitle} />
        )}
      </CardContent>
    </Card>
  );
}
