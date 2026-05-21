"use client";

import { Button } from "@/shared/ui/button";
import { ru } from "@/shared/i18n";

export function OfflineActions() {
  return (
    <Button variant="outline" type="button" onClick={() => window.location.reload()}>
      {ru.common.retry}
    </Button>
  );
}
