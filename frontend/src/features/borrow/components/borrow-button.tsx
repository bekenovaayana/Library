"use client";

import { useState } from "react";
import { BookMarked } from "lucide-react";
import { useBorrowBook } from "@/features/borrow/hooks/useBorrowBook";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/components/spinner";
import type { BookStatus } from "@/features/books/types/book";

interface BorrowButtonProps {
  bookId: number;
  bookTitle: string;
  status: BookStatus;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function BorrowButton({
  bookId,
  bookTitle,
  status,
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
        title={isUnavailable ? "Book is not available" : "Borrow this book"}
      >
        {isPending ? (
          <>
            <Spinner size="sm" className="text-primary-foreground" />
            <span className="truncate">…</span>
          </>
        ) : (
          <>
            <BookMarked className="h-4 w-4 shrink-0" />
            <span className="truncate">Borrow</span>
          </>
        )}
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Confirm borrow"
        description={`Do you want to borrow "${bookTitle}"?`}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="text-primary-foreground" />
                  Confirming...
                </>
              ) : (
                "Confirm borrow"
              )}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          The book will be marked as borrowed and added to your account until you return it.
        </p>
      </Modal>
    </>
  );
}
