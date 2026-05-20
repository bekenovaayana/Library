"use client";

import { Button } from "@/shared/ui/button";

export function OfflineActions() {
  return (
    <Button variant="outline" type="button" onClick={() => window.location.reload()}>
      Retry
    </Button>
  );
}
