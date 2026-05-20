import {
  AUTH_COOKIE,
  AUTH_REFRESH_KEY,
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_KEY,
} from "@/shared/constants/api";
import type { UserRole } from "@/shared/types/auth";
import { removeStorageItem, setStorageItem } from "@/shared/utils/storage";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function setAuthCookies(token: string, role: UserRole, refreshToken?: string): void {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  document.cookie = `${AUTH_ROLE_COOKIE}=${role}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  setStorageItem(AUTH_TOKEN_KEY, token);

  if (refreshToken) {
    setStorageItem(AUTH_REFRESH_KEY, refreshToken);
  }
}

export function clearAuthCookies(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${AUTH_ROLE_COOKIE}=; path=/; max-age=0`;
  removeStorageItem(AUTH_TOKEN_KEY);
  removeStorageItem(AUTH_REFRESH_KEY);
}
