"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useBookDetail } from "@/features/books/hooks/useBookDetail";
import { BookDetailsCard } from "@/features/books/components/book-details-card";
import { BorrowButton } from "@/features/borrow/components/borrow-button";
import { ReserveButton } from "@/features/reservations/components/reserve-button";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/components/spinner";
import { buildEstimatedDueDate } from "@/features/library/hooks/useLibraryPolicy";
import { ROUTES } from "@/shared/constants/routes";
import type { BookDetail } from "@/features/books/types/book-detail";
import { ru } from "@/shared/i18n";

interface BookDetailsViewProps {
  bookId: number;
  initialBook: BookDetail;
}

export function BookDetailsView({ bookId, initialBook }: BookDetailsViewProps) {
  const { data: book, isFetching } = useBookDetail(bookId, initialBook);

  if (!book) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" asChild>
          <Link href={ROUTES.BOOKS}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {ru.books.backToCatalog}
          </Link>
        </Button>

        {book.status === "AVAILABLE" ? (
          <BorrowButton
            bookId={book.id}
            bookTitle={book.title}
            status={book.status}
            lendingTerms={{
              borrowDays: book.borrowDays ?? 14,
              finePerDay: book.finePerDay ?? 1,
              maxFine: book.maxFine ?? 50,
              estimatedDueDate: book.estimatedDueDate,
            }}
          />
        ) : (
          <ReserveButton
            bookId={book.id}
            bookTitle={book.title}
            userHasReservation={book.userHasReservation}
            queueSize={book.reservationQueueSize}
            lendingTerms={{
              borrowDays: book.borrowDays ?? 14,
              finePerDay: book.finePerDay ?? 1,
              maxFine: book.maxFine ?? 50,
              estimatedDueDate: buildEstimatedDueDate(book.borrowDays ?? 14),
            }}
          />
        )}

        {isFetching && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner size="sm" />
            {ru.books.updatingBook}
          </span>
        )}
      </div>

      <BookDetailsCard book={book} />
    </div>
  );
}
