"use client";

import Link from "next/link";
import { User } from "lucide-react";
import {
  buildEstimatedDueDate,
  DEFAULT_LIBRARY_POLICY,
  useLibraryPolicy,
} from "@/features/library/hooks/useLibraryPolicy";
import { BookCover } from "@/features/books/components/book-cover";
import { BorrowButton } from "@/features/borrow/components/borrow-button";
import { ReserveButton } from "@/features/reservations/components/reserve-button";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { bookDetailRoute } from "@/shared/constants/routes";
import type { Book } from "@/features/books/types/book";

interface BookCardProps {
  book: Book;
  className?: string;
}

const statusConfig = {
  AVAILABLE: {
    label: "Available",
    className: "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400",
  },
  BORROWED: {
    label: "Borrowed",
    className: "bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-400",
  },
} as const;

export function BookCard({ book, className }: BookCardProps) {
  const { data: policy } = useLibraryPolicy();
  const lending = policy ?? DEFAULT_LIBRARY_POLICY;
  const status = statusConfig[book.status];
  const lendingTerms = {
    borrowDays: lending.borrowDays,
    finePerDay: lending.finePerDay,
    maxFine: lending.maxFine,
    estimatedDueDate:
      book.status === "AVAILABLE" ? buildEstimatedDueDate(lending.borrowDays) : null,
  };

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-border/80 transition-all duration-200",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      <BookCover title={book.title} coverUrl={book.coverUrl} className="mx-4 mt-4 w-[calc(100%-2rem)]" />

      <CardHeader className="space-y-3 pb-0 pt-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="min-w-0 flex-1 text-base font-semibold leading-snug sm:text-[1.05rem]">
            <Link
              href={bookDetailRoute(book.id)}
              className="line-clamp-2 transition-colors hover:text-primary"
            >
              {book.title}
            </Link>
          </CardTitle>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>
        <span className="inline-flex w-fit max-w-full rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {book.category}
        </span>
      </CardHeader>

      <CardContent className="flex-1 space-y-2.5 pb-4 pt-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
          <span className="line-clamp-1">{book.author}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t bg-muted/20 p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" asChild className="h-9 w-full text-xs sm:text-sm">
            <Link href={bookDetailRoute(book.id)}>Details</Link>
          </Button>
          {book.status === "AVAILABLE" ? (
            <BorrowButton
              bookId={book.id}
              bookTitle={book.title}
              status={book.status}
              lendingTerms={lendingTerms}
              size="sm"
              className="h-9 w-full text-xs sm:text-sm"
            />
          ) : (
            <ReserveButton
              bookId={book.id}
              bookTitle={book.title}
              userHasReservation={book.userHasReservation}
              queueSize={book.reservationQueueSize ?? 0}
              lendingTerms={lendingTerms}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
