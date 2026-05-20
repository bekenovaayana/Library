"use client";

import { ConfirmModal } from "@/shared/components/confirm-modal";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  bookTitle,
  onConfirm,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete book"
      description={`Are you sure you want to delete "${bookTitle}"?`}
      confirmLabel="Delete"
      variant="destructive"
      onConfirm={onConfirm}
      isLoading={isLoading}
    >
      <p className="text-sm text-muted-foreground">
        This will permanently remove the book from the catalog. Books that are currently borrowed
        cannot be deleted.
      </p>
    </ConfirmModal>
  );
}
