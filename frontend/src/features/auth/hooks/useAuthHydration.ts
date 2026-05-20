"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { setAuthCookies } from "@/shared/utils/auth-cookies";

export function useAuthHydration() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated);

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      const { token, user } = useAuthStore.getState();

      if (token && user) {
        setAuthCookies(token, user.role);
      }

      setHasHydrated(true);
    });

    void useAuthStore.persist.rehydrate();

    return unsubscribe;
  }, [setHasHydrated]);

  return hasHydrated;
}
