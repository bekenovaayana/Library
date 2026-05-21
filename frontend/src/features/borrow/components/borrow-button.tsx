"use client";

import { useState } from "react";
import { BookMarked } from "lucide-react";
import { useBorrowBook } from "@/features/borrow/hooks/useBorrowBook";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/components/spinner";
import type { BookStatus } from "@/features/books/types/book";
import {
  LendingTermsSummary,
  type LendingTerms,
} from "@/features/borrow/components/lending-terms-summary";
import { ru } from "@/shared/i18n";

interface BorrowButtonProps {
  bookId: number;
  bookTitle: string;
  status: BookStatus;
  lendingTerms: LendingTerms;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function BorrowButton({
  bookId,
  bookTitle,
  status,
  lendingTerms,
  className,
  size = "default",
}: BorrowButtonProps) {
  const [open, setOpen] = useState(false);
  const borrowMutation = useBorrowBook();

  const isUnavailable = status !== "AVAILABLE";
  const isPending = borrowMutation.isPending;

  const handleConfirm = () => {
    borrowMutation.mutate(
      { bookId },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <>
      <Button
        size={size}
        className={className}
        disabled={isUnavailable || isPending}
        onClick={() => setOpen(true)}
        title={isUnavailable ? ru.borrow.notAvailable : ru.borrow.borrowThis}
      >
        {isPending ? (
          <>
            <Spinner size="sm" className="text-primary-foreground" />
            <span className="truncate">…</span>
          </>
        ) : (
          <>
            <BookMarked className="h-4 w-4 shrink-0" />
            <span className="truncate">{ru.borrow.borrow}</span>
          </>
        )}
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={ru.borrow.confirmBorrow}
        description={ru.borrow.confirmBorrowDesc(bookTitle)}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              {ru.common.cancel}
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="text-primary-foreground" />
                  {ru.borrow.confirming}
                </>
              ) : (
                ru.borrow.confirmBorrow
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <LendingTermsSummary terms={lendingTerms} />
          <p className="text-sm text-muted-foreground">{ru.borrow.borrowHint}</p>
        </div>
      </Modal>
    </>
  );
}
