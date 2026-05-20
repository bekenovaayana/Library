import { cn } from "@/shared/lib/utils";
import type { BorrowRecordStatus } from "@/features/borrow/types/borrow";

interface BorrowStatusBadgeProps {
  status: BorrowRecordStatus;
  className?: string;
}

const styles: Record<BorrowRecordStatus, string> = {
  ACTIVE: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  RETURNED: "bg-muted text-muted-foreground",
};

const labels: Record<BorrowRecordStatus, string> = {
  ACTIVE: "Active",
  RETURNED: "Returned",
};

export function BorrowStatusBadge({ status, className }: BorrowStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        styles[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}
