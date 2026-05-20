"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reservationApi } from "@/features/reservations/api/reservationApi";
import { borrowKeys } from "@/features/borrow/hooks/query-keys";
import { bookKeys } from "@/features/books/hooks/book-keys";
import { Button } from "@/shared/ui/button";
import { getApiErrorMessage } from "@/services/api/apiClient";

interface ReserveButtonProps {
  bookId: number;
  bookTitle: string;
  userHasReservation?: boolean;
  queueSize?: number;
}

export function ReserveButton({
  bookId,
  bookTitle,
  userHasReservation = false,
  queueSize = 0,
}: ReserveButtonProps) {
  const queryClient = useQueryClient();

  const reserveMutation = useMutation({
    mutationFn: () => reservationApi.reserve(bookId),
    onSuccess: (data) => {
      toast.success(`Added to waitlist (#${data.queuePosition}) for "${bookTitle}"`);
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const cancelMutation = useMutation({
    mutationFn: () => reservationApi.cancel(bookId),
    onSuccess: () => {
      toast.success("Removed from waitlist");
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
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

  return (
    <Button
      variant="secondary"
      onClick={() => reserveMutation.mutate()}
      disabled={reserveMutation.isPending}
    >
      Join waitlist{queueSize > 0 ? ` (${queueSize} ahead)` : ""}
    </Button>
  );
}
