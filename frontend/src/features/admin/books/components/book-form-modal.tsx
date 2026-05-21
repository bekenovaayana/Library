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
import { ru } from "@/shared/i18n";

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
      title={isEdit ? ru.admin.editBook : ru.admin.addBook}
      description={isEdit ? ru.admin.editBookDesc : ru.admin.addBookDesc}
      contentClassName="sm:max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {ru.common.cancel}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner size="sm" className="text-primary-foreground" />
                {isEdit ? ru.admin.saving : ru.admin.adding}
              </>
            ) : isEdit ? (
              ru.admin.saveChanges
            ) : (
              ru.admin.addBook
            )}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label={ru.books.titleField} htmlFor="book-title" error={errors.title?.message}>
          <Input
            id="book-title"
            placeholder={ru.admin.exampleTitle}
            disabled={isPending}
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
        </FormField>

        <FormField label={ru.books.author} htmlFor="book-author" error={errors.author?.message}>
          <Input
            id="book-author"
            placeholder={ru.admin.exampleAuthor}
            disabled={isPending}
            aria-invalid={Boolean(errors.author)}
            {...register("author")}
          />
        </FormField>

        <FormField
          label={ru.books.categoryLabel}
          htmlFor="book-category"
          error={errors.category?.message}
        >
          <Input
            id="book-category"
            placeholder={ru.admin.exampleCategory}
            disabled={isPending}
            aria-invalid={Boolean(errors.category)}
            {...register("category")}
          />
        </FormField>

        <FormField label={ru.admin.coverUrl} htmlFor="book-cover" error={errors.coverUrl?.message}>
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
