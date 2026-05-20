"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { borrowApi } from "@/features/borrow/api/borrowApi";
import { borrowKeys } from "@/features/borrow/hooks/query-keys";
import { BOOKS_QUERY_KEY } from "@/features/books/hooks/useBooks";
import { bookKeys } from "@/features/books/hooks/book-keys";
import type { BookDetail } from "@/features/books/types/book-detail";
import type { BorrowRecord } from "@/features/borrow/types/borrow";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { useAuthStore } from "@/store/authStore";

interface BorrowContext {
  previousBookDetail?: BookDetail;
}

export function useBorrowBook() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const username = useAuthStore((state) => state.user?.username ?? "");

  return useMutation({
    mutationFn: borrowApi.borrowBook,
    onMutate: async ({ bookId }) => {
      await queryClient.cancelQueries({ queryKey: borrowKeys.my() });
      await queryClient.cancelQueries({ queryKey: bookKeys.detail(bookId) });

      const previousBookDetail = queryClient.getQueryData<BookDetail>(bookKeys.detail(bookId));

      if (previousBookDetail) {
        queryClient.setQueryData<BookDetail>(bookKeys.detail(bookId), {
          ...previousBookDetail,
          status: "BORROWED",
          currentBorrow: {
            borrowId: -1,
            username,
            borrowDate: new Date().toISOString(),
          },
        });
      }

      return { previousBookDetail, bookId } satisfies BorrowContext & {
        bookId: number;
      };
    },
    onSuccess: (data, { bookId }) => {
      toast.success(`Successfully borrowed "${data.bookTitle}"`);
      void queryClient.invalidateQueries({ queryKey: borrowKeys.my() });
      void queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: bookKeys.detail(bookId) });
      router.refresh();
    },
    onError: (error, { bookId }, context) => {
      if (context?.previousBookDetail) {
        queryClient.setQueryData(bookKeys.detail(bookId), context.previousBookDetail);
      }
      toast.error(getApiErrorMessage(error));
    },
  });
}
