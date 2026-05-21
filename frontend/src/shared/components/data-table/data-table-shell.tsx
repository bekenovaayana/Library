import { EmptyState } from "@/shared/components/empty-state";
import { TableSkeleton } from "@/shared/ux/skeleton";
import { cn } from "@/shared/lib/utils";
import { ru } from "@/shared/i18n";

interface DataTableShellProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  colSpan?: number;
  className?: string;
}

export function DataTableShell({
  children,
  isLoading,
  isEmpty,
  emptyTitle = ru.common.noResults,
  emptyDescription = ru.common.noResultsHint,
  emptyIcon,
  className,
}: DataTableShellProps) {
  if (isLoading) {
    return (
      <div className={cn("rounded-lg border p-4", className)}>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cn("rounded-lg border", className)}>
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyIcon} />
      </div>
    );
  }

  return <div className={cn("rounded-lg border", className)}>{children}</div>;
}
