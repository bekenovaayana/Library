"use client";

import { ru } from "@/shared/i18n";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/components/spinner";

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = ru.common.confirm,
  cancelLabel = ru.common.cancel,
  onConfirm,
  isLoading = false,
  variant = "default",
  children,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="text-primary-foreground" />
                {confirmLabel}...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </>
      }
    >
      {children ?? (
        <p className="text-sm text-muted-foreground">{ru.common.actionCannotBeUndone}</p>
      )}
    </Modal>
  );
}
