"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { borrowApi } from "@/features/borrow/api/borrowApi";
import { borrowKeys } from "@/features/borrow/hooks/query-keys";
import { BOOKS_QUERY_KEY } from "@/features/books/hooks/useBooks";
import { bookKeys } from "@/features/books/hooks/book-keys";
import type { BorrowRecord } from "@/features/borrow/types/borrow";
import { getApiErrorMessage } from "@/services/api/apiClient";

interface ReturnContext {
  previousMyBorrows?: BorrowRecord[];
}

export function useReturnBook() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: borrowApi.returnBook,
    onMutate: async (borrowId) => {
      await queryClient.cancelQueries({ queryKey: borrowKeys.my() });

      const previousMyBorrows = queryClient.getQueryData<BorrowRecord[]>(borrowKeys.my());

      if (previousMyBorrows) {
        queryClient.setQueryData<BorrowRecord[]>(
          borrowKeys.my(),
          previousMyBorrows.map((record) =>
            record.borrowId === borrowId
              ? {
                  ...record,
                  status: "RETURNED" as const,
                  returnDate: new Date().toISOString(),
                }
              : record,
          ),
        );
      }

      return { previousMyBorrows, borrowId } satisfies ReturnContext & { borrowId: number };
    },
    onSuccess: (data) => {
      toast.success(`Returned "${data.bookTitle}"`);
      void queryClient.invalidateQueries({ queryKey: borrowKeys.my() });
      void queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: bookKeys.all });
      router.refresh();
    },
    onError: (error, _borrowId, context) => {
      if (context?.previousMyBorrows) {
        queryClient.setQueryData(borrowKeys.my(), context.previousMyBorrows);
      }
      toast.error(getApiErrorMessage(error));
    },
  });
}
