import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "@/shared/constants/api";
import { ROUTES } from "@/shared/constants/routes";
import type { ApiErrorResponse } from "@/shared/types/api";
import { getStorageItem } from "@/shared/utils/storage";
import { useAuthStore } from "@/store/authStore";
import { APIErrorHandler } from "@/shared/ux/api/api-error-handler";
import { isApiError } from "@/services/api/errors";
import { refreshAccessToken } from "@/services/api/refreshAccessToken";

export { isApiError } from "@/services/api/errors";

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (APIErrorHandler.isBrowserOffline()) {
    return Promise.reject({
      timestamp: new Date().toISOString(),
      status: 0,
      error: "Offline",
      message: "You appear to be offline. Check your connection and try again.",
      path: config.url ?? "",
    } satisfies ApiErrorResponse);
  }

  const token = getStorageItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    if (
      status === 401 &&
      typeof window !== "undefined" &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }

      useAuthStore.getState().clearAuth();
      const currentPath = window.location.pathname;
      const loginUrl = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(currentPath)}`;
      window.location.href = loginUrl;
    }

    const responseMessage = error.response?.data?.message;
    const apiError: ApiErrorResponse = error.response?.data ?? {
      timestamp: new Date().toISOString(),
      status: status ?? 0,
      error: error.response?.statusText ?? "Error",
      message:
        responseMessage ||
        (status && status >= 500
          ? "Server error. Please try again later."
          : error.code === "ERR_NETWORK"
            ? "Unable to reach the server. Please try again shortly."
            : error.message || "An unexpected error occurred"),
      path: error.config?.url ?? "",
    };

    const parsed = APIErrorHandler.parse(apiError);

    if (APIErrorHandler.shouldShowGlobalToast(parsed) && !isAuthEndpoint) {
      APIErrorHandler.handle(apiError, { toast: true, silent: parsed.kind === "unauthorized" });
    }

    return Promise.reject(apiError);
  },
);

export function getApiErrorMessage(error: unknown): string {
  return APIErrorHandler.getMessage(error);
}
