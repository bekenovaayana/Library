import { cn } from "@/shared/lib/utils";
import { borrowStatusLabel } from "@/shared/i18n";
import type { BorrowRecordStatus } from "@/features/borrow/types/borrow";

interface BorrowStatusBadgeProps {
  status: BorrowRecordStatus;
  overdue?: boolean;
  className?: string;
}

const styles: Record<BorrowRecordStatus, string> = {
  ACTIVE: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  RETURNED: "bg-muted text-muted-foreground",
};

export function BorrowStatusBadge({ status, overdue = false, className }: BorrowStatusBadgeProps) {
  const label =
    overdue && status === "ACTIVE"
      ? borrowStatusLabel("OVERDUE")
      : borrowStatusLabel(status);
  const style =
    overdue && status === "ACTIVE"
      ? "bg-destructive/10 text-destructive"
      : styles[status];

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
