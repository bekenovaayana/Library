import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, UserRole } from "@/shared/types/auth";
import { clearAuthCookies, setAuthCookies } from "@/shared/utils/auth-cookies";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (user: AuthUser, token: string, refreshToken: string) => void;
  updateTokens: (token: string, refreshToken: string) => void;
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      setAuth: (user, token, refreshToken) => {
        setAuthCookies(token, user.role, refreshToken);
        set({ user, token, refreshToken, isAuthenticated: true });
      },

      updateTokens: (token, refreshToken) => {
        const { user } = get();
        if (user) {
          setAuthCookies(token, user.role, refreshToken);
        }
        set({ token, refreshToken, isAuthenticated: Boolean(token && get().user) });
      },

      clearAuth: () => {
        clearAuthCookies();
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),

      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },
    }),
    {
      name: "library-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && state.user) {
          setAuthCookies(state.token, state.user.role, state.refreshToken ?? undefined);
        }
      },
    },
  ),
);
