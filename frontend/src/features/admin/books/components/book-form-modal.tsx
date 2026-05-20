"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookFormDefaultValues,
  bookFormSchema,
  type BookFormValues,
} from "@/features/admin/books/schemas/book-form.schema";
import { useCreateBook } from "@/features/admin/books/hooks/useCreateBook";
import { useUpdateBook } from "@/features/admin/books/hooks/useUpdateBook";
import { Modal } from "@/shared/components/modal";
import { FormField } from "@/shared/components/form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/components/spinner";
import type { Book } from "@/features/books/types/book";

interface BookFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
}

export function BookFormModal({ open, onOpenChange, book }: BookFormModalProps) {
  const isEdit = Boolean(book);
  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();

  const activeMutation = isEdit ? updateMutation : createMutation;
  const isPending = activeMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: bookFormDefaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        book
          ? {
              title: book.title,
              author: book.author,
              category: book.category,
              coverUrl: book.coverUrl ?? "",
            }
          : bookFormDefaultValues,
      );
    }
  }, [open, book, reset]);

  const onSubmit = (values: BookFormValues) => {
    const payload = {
      ...values,
      coverUrl: values.coverUrl?.trim() || undefined,
    };
    if (isEdit && book) {
      updateMutation.mutate(
        { id: book.id, payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit book" : "Add book"}
      description={
        isEdit ? "Update book details in the catalog." : "Add a new book to the library catalog."
      }
      contentClassName="sm:max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner size="sm" className="text-primary-foreground" />
                {isEdit ? "Saving..." : "Adding..."}
              </>
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Add book"
            )}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Title" htmlFor="book-title" error={errors.title?.message}>
          <Input
            id="book-title"
            placeholder="Clean Code"
            disabled={isPending}
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
        </FormField>

        <FormField label="Author" htmlFor="book-author" error={errors.author?.message}>
          <Input
            id="book-author"
            placeholder="Robert C. Martin"
            disabled={isPending}
            aria-invalid={Boolean(errors.author)}
            {...register("author")}
          />
        </FormField>

        <FormField label="Category" htmlFor="book-category" error={errors.category?.message}>
          <Input
            id="book-category"
            placeholder="Programming"
            disabled={isPending}
            aria-invalid={Boolean(errors.category)}
            {...register("category")}
          />
        </FormField>

        <FormField label="Cover URL" htmlFor="book-cover" error={errors.coverUrl?.message}>
          <Input
            id="book-cover"
            placeholder="https://..."
            disabled={isPending}
            aria-invalid={Boolean(errors.coverUrl)}
            {...register("coverUrl")}
          />
        </FormField>
      </form>
    </Modal>
  );
}
