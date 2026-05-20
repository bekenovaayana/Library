"use client";

import { useEffect, useState } from "react";

/**
 * Returns online status after mount to avoid SSR/client hydration mismatch.
 * Defaults to `true` until the browser state is read in useEffect.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const syncStatus = () => setIsOnline(navigator.onLine);

    syncStatus();
    window.addEventListener("online", syncStatus);
    window.addEventListener("offline", syncStatus);

    return () => {
      window.removeEventListener("online", syncStatus);
      window.removeEventListener("offline", syncStatus);
    };
  }, []);

  return isOnline;
}
