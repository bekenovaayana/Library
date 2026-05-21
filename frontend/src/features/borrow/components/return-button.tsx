"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useReturnBook } from "@/features/borrow/hooks/useReturnBook";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/components/spinner";
import { ru } from "@/shared/i18n";

interface ReturnButtonProps {
  borrowId: number;
  bookTitle: string;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ReturnButton({
  borrowId,
  bookTitle,
  variant = "outline",
  size = "sm",
}: ReturnButtonProps) {
  const [open, setOpen] = useState(false);
  const returnMutation = useReturnBook();
  const isPending = returnMutation.isPending;

  const handleConfirm = () => {
    returnMutation.mutate(borrowId, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <>
      <Button variant={variant} size={size} disabled={isPending} onClick={() => setOpen(true)}>
        {isPending ? (
          <>
            <Spinner size="sm" />
            {ru.borrow.returning}
          </>
        ) : (
          <>
            <RotateCcw className="mr-2 h-4 w-4" />
            {ru.borrow.return}
          </>
        )}
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={ru.borrow.confirmReturn}
        description={ru.borrow.confirmReturnDesc(bookTitle)}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              {ru.common.cancel}
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="text-primary-foreground" />
                  {ru.borrow.confirming}
                </>
              ) : (
                ru.borrow.confirmReturn
              )}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">{ru.borrow.returnHint}</p>
      </Modal>
    </>
  );
}
