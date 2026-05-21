import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "@/shared/constants/api";
import { ROUTES } from "@/shared/constants/routes";
import type { ApiErrorResponse } from "@/shared/types/api";
import { getStorageItem } from "@/shared/utils/storage";
import { useAuthStore } from "@/store/authStore";
import { ru } from "@/shared/i18n";
import { APIErrorHandler } from "@/shared/ux/api/api-error-handler";
import { isApiError } from "@/services/api/errors";
import { refreshAccessToken } from "@/services/api/refreshAccessToken";

export { isApiError } from "@/services/api/errors";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  silentError?: boolean;
};

function isSilentErrorRequest(config: RetryableRequestConfig | undefined): boolean {
  if (!config) return false;
  if (config.silentError) return true;
  const url = config.url ?? "";
  return url.includes("/library/policy");
}

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
      message: ru.errors.offline,
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
          ? ru.errors.server
          : error.code === "ERR_NETWORK"
            ? ru.errors.network
            : error.message || ru.errors.unexpected),
      path: error.config?.url ?? "",
    };

    const parsed = APIErrorHandler.parse(apiError);

    if (
      APIErrorHandler.shouldShowGlobalToast(parsed) &&
      !isAuthEndpoint &&
      !isSilentErrorRequest(originalRequest)
    ) {
      APIErrorHandler.handle(apiError, { toast: true, silent: parsed.kind === "unauthorized" });
    }

    return Promise.reject(apiError);
  },
);

export function getApiErrorMessage(error: unknown): string {
  return APIErrorHandler.getMessage(error);
}
