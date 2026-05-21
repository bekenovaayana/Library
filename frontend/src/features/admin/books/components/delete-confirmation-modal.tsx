"use client";

import { ConfirmModal } from "@/shared/components/confirm-modal";
import { ru } from "@/shared/i18n";

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
      title={ru.admin.deleteBook}
      description={ru.admin.deleteConfirm(bookTitle)}
      confirmLabel={ru.common.delete}
      variant="destructive"
      onConfirm={onConfirm}
      isLoading={isLoading}
    >
      <p className="text-sm text-muted-foreground">{ru.admin.deleteHint}</p>
    </ConfirmModal>
  );
}
