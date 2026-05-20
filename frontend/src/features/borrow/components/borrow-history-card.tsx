import { Calendar, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatBorrowDate } from "@/features/borrow/utils/format-date";
import { BorrowStatusBadge } from "@/features/borrow/components/borrow-status-badge";
import { ReturnButton } from "@/features/borrow/components/return-button";
import type { BorrowRecord } from "@/features/borrow/types/borrow";

interface BorrowHistoryCardProps {
  record: BorrowRecord;
}

export function BorrowHistoryCard({ record }: BorrowHistoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
        <CardTitle className="line-clamp-2 text-base leading-snug">{record.bookTitle}</CardTitle>
        <BorrowStatusBadge status={record.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>Borrowed: {formatBorrowDate(record.borrowDate)}</span>
        </div>
        {record.returnDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Returned: {formatBorrowDate(record.returnDate)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Hash className="h-3.5 w-3.5" />
          Record #{record.borrowId}
        </div>
        {record.status === "ACTIVE" && (
          <ReturnButton borrowId={record.borrowId} bookTitle={record.bookTitle} />
        )}
      </CardContent>
    </Card>
  );
}
