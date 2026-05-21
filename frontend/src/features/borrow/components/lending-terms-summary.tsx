import { Calendar, CircleDollarSign } from "lucide-react";
import { formatBorrowDate } from "@/features/borrow/utils/format-date";
import { formatMoney } from "@/features/borrow/utils/format-money";
import { ru } from "@/shared/i18n";

export interface LendingTerms {
  borrowDays: number;
  finePerDay: number;
  maxFine: number;
  estimatedDueDate?: string | null;
}

interface LendingTermsSummaryProps {
  terms: LendingTerms;
  variant?: "default" | "compact";
}

export function LendingTermsSummary({ terms, variant = "default" }: LendingTermsSummaryProps) {
  const dueLabel = terms.estimatedDueDate ? formatBorrowDate(terms.estimatedDueDate) : "—";

  if (variant === "compact") {
    return (
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li>
          <strong className="text-foreground">{ru.borrow.returnByLabel}</strong> {dueLabel}
        </li>
        <li>
          <strong className="text-foreground">{ru.borrow.lateFeeLabel}</strong>{" "}
          {formatMoney(terms.finePerDay)}
          {ru.borrow.perDay} ({ru.borrow.maximum} {formatMoney(terms.maxFine)})
        </li>
      </ul>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">{ru.books.returnBy}</p>
          <p className="text-base font-semibold">{dueLabel}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {ru.borrow.loanPeriod(terms.borrowDays)}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <CircleDollarSign className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">{ru.borrow.lateFeeIfOverdue}</p>
          <p className="text-base font-semibold">
            {formatMoney(terms.finePerDay)}{" "}
            <span className="text-sm font-normal">{ru.borrow.perDay}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {ru.borrow.maximum} {formatMoney(terms.maxFine)}
          </p>
        </div>
      </div>
    </div>
  );
}
