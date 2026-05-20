"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reservationApi } from "@/features/reservations/api/reservationApi";
import { bookKeys } from "@/features/books/hooks/book-keys";
import {
  LendingTermsSummary,
  type LendingTerms,
} from "@/features/borrow/components/lending-terms-summary";
import { buildEstimatedDueDate } from "@/features/library/hooks/useLibraryPolicy";
import {
  patchBookDetailCache,
  patchBookInCatalogCaches,
} from "@/features/reservations/lib/patch-book-cache";
import type { Book } from "@/features/books/types/book";
import type { BookDetail } from "@/features/books/types/book-detail";
import type { PaginatedResponse } from "@/shared/types/api";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/components/spinner";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { isApiError } from "@/services/api/errors";

interface ReserveButtonProps {
  bookId: number;
  bookTitle: string;
  userHasReservation?: boolean;
  queueSize?: number;
  lendingTerms: LendingTerms;
}

export function ReserveButton({
  bookId,
  bookTitle,
  userHasReservation = false,
  queueSize = 0,
  lendingTerms,
}: ReserveButtonProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const waitlistTerms: LendingTerms = {
    ...lendingTerms,
    estimatedDueDate: buildEstimatedDueDate(lendingTerms.borrowDays),
  };

  const reserveMutation = useMutation({
    mutationFn: () => reservationApi.reserve(bookId),
    onSuccess: (data) => {
      setOpen(false);
      toast.success(`Added to waitlist (#${data.queuePosition}) for "${bookTitle}"`);

      queryClient.setQueriesData<PaginatedResponse<Book>>(
        { queryKey: bookKeys.all },
        (old) =>
          patchBookInCatalogCaches(old, bookId, {
            userHasReservation: true,
            reservationQueueSize: data.queuePosition,
          }),
      );

      queryClient.setQueryData<BookDetail>(bookKeys.detail(bookId), (old) =>
        patchBookDetailCache(old, {
          userHasReservation: true,
          reservationQueueSize: data.queuePosition,
        }),
      );
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 409) {
        queryClient.setQueriesData<PaginatedResponse<Book>>(
          { queryKey: bookKeys.all },
          (old) =>
            patchBookInCatalogCaches(old, bookId, {
              userHasReservation: true,
            }),
        );
        queryClient.setQueryData<BookDetail>(bookKeys.detail(bookId), (old) =>
          patchBookDetailCache(old, { userHasReservation: true }),
        );
        return;
      }
      toast.error(getApiErrorMessage(error));
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => reservationApi.cancel(bookId),
    onSuccess: () => {
      toast.success("Removed from waitlist");
      queryClient.setQueriesData<PaginatedResponse<Book>>(
        { queryKey: bookKeys.all },
        (old) =>
          patchBookInCatalogCaches(old, bookId, {
            userHasReservation: false,
            reservationQueueSize: Math.max(0, (queueSize ?? 1) - 1),
          }),
      );
      queryClient.setQueryData<BookDetail>(bookKeys.detail(bookId), (old) =>
        patchBookDetailCache(old, {
          userHasReservation: false,
          reservationQueueSize: Math.max(0, (queueSize ?? 1) - 1),
        }),
      );
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  if (userHasReservation) {
    return (
      <Button
        variant="outline"
        onClick={() => cancelMutation.mutate()}
        disabled={cancelMutation.isPending}
      >
        Leave waitlist
      </Button>
    );
  }

  const isPending = reserveMutation.isPending;

  const handleConfirm = () => {
    if (isPending || reserveMutation.isSuccess) return;
    reserveMutation.mutate();
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        Join waitlist{queueSize > 0 ? ` (${queueSize} ahead)` : ""}
      </Button>

      <Modal
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next && !reserveMutation.isPending) {
            reserveMutation.reset();
          }
        }}
        title="Join waitlist"
        description={`Reserve your place for "${bookTitle}"`}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="text-primary-foreground" />
                  Joining...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <LendingTermsSummary terms={waitlistTerms} />
          <p className="text-sm text-muted-foreground">
            When the book becomes available, these loan terms will apply if you borrow it.
          </p>
        </div>
      </Modal>
    </>
  );
}
