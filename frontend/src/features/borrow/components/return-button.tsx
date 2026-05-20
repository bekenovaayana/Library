"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useReturnBook } from "@/features/borrow/hooks/useReturnBook";
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/components/spinner";

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
      <Button
        variant={variant}
        size={size}
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        {isPending ? (
          <>
            <Spinner size="sm" />
            Returning...
          </>
        ) : (
          <>
            <RotateCcw className="mr-2 h-4 w-4" />
            Return
          </>
        )}
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Confirm return"
        description={`Return "${bookTitle}" to the library?`}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="text-primary-foreground" />
                  Confirming...
                </>
              ) : (
                "Confirm return"
              )}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          The book will become available for other users after you return it.
        </p>
      </Modal>
    </>
  );
}
