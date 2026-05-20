import axios from "axios";
import { API_BASE_URL, AUTH_REFRESH_KEY } from "@/shared/constants/api";
import type { AuthResponse } from "@/shared/types/auth";
import { getStorageItem } from "@/shared/utils/storage";
import { useAuthStore } from "@/store/authStore";

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getStorageItem(AUTH_REFRESH_KEY);
    if (!refreshToken) {
      return null;
    }

    try {
      const { data } = await refreshClient.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      });
      useAuthStore.getState().updateTokens(data.token, data.refreshToken);
      return data.token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
