import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { OfflineActions } from "@/app/offline/offline-actions";

export const metadata = createPageMetadata(
  "Offline",
  "You are currently offline. Reconnect to continue using the library application.",
  "/offline",
);

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <WifiOff className="h-12 w-12 text-muted-foreground" aria-hidden />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="max-w-md text-muted-foreground">
          Cached pages may still be available. Reconnect to the internet to browse books and
          manage your account.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href={ROUTES.HOME}>Go home</Link>
        </Button>
        <OfflineActions />
      </div>
    </main>
  );
}
