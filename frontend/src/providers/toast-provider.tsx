"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      visibleToasts={4}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "border border-border bg-background text-foreground shadow-lg animate-in slide-in-from-top-2 duration-300",
          title: "text-sm font-medium",
          description: "text-sm text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
    />
  );
}