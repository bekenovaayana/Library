import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/shared/types/api";
import { isApiError } from "@/services/api/errors";
import { showErrorToast } from "@/shared/ux/toast/toast";

export type ApiErrorKind =
  | "offline"
  | "network"
  | "timeout"
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "server"
  | "unknown";

export interface ParsedApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  original: unknown;
}

export interface ApiErrorHandleOptions {
  toast?: boolean;
  title?: string;
  silent?: boolean;
}

const OFFLINE_MESSAGE =
  "You appear to be offline. Check your connection and try again.";
const NETWORK_MESSAGE = "Unable to reach the server. Please try again shortly.";
const TIMEOUT_MESSAGE = "The request timed out. Please try again.";
const DEFAULT_MESSAGE = "An unexpected error occurred. Please try again.";

export class APIErrorHandler {
  static isBrowserOffline(): boolean {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.onLine === "boolean" &&
      !navigator.onLine
    );
  }

  static parse(error: unknown): ParsedApiError {
    if (APIErrorHandler.isBrowserOffline()) {
      return { kind: "offline", message: OFFLINE_MESSAGE, original: error };
    }

    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError?.code === "ECONNABORTED" || axiosError?.message?.includes("timeout")) {
      return { kind: "timeout", message: TIMEOUT_MESSAGE, original: error };
    }

    if (!axiosError?.response) {
      if (axiosError?.code === "ERR_NETWORK" || axiosError?.message === "Network Error") {
        return { kind: "network", message: NETWORK_MESSAGE, original: error };
      }
    }

    if (isApiError(error)) {
      const status = error.status;

      if (
        status === 0 &&
        (error.message === "Network Error" || error.message?.includes("reach the server"))
      ) {
        return { kind: "network", message: NETWORK_MESSAGE, status, original: error };
      }

      const kind = APIErrorHandler.kindFromStatus(status);
      const message = APIErrorHandler.messageFromApiError(error);

      return { kind, message, status, original: error };
    }

    if (error instanceof Error && error.message) {
      return { kind: "unknown", message: error.message, original: error };
    }

    return { kind: "unknown", message: DEFAULT_MESSAGE, original: error };
  }

  static getMessage(error: unknown): string {
    return APIErrorHandler.parse(error).message;
  }

  static handle(error: unknown, options: ApiErrorHandleOptions = {}): ParsedApiError {
    const parsed = APIErrorHandler.parse(error);
    const shouldToast =
      options.toast !== false &&
      !options.silent &&
      parsed.kind !== "unauthorized" &&
      typeof window !== "undefined";

    if (shouldToast) {
      showErrorToast(parsed.message, options.title);
    }

    return parsed;
  }

  static shouldShowGlobalToast(parsed: ParsedApiError): boolean {
    return (
      parsed.kind === "offline" ||
      parsed.kind === "network" ||
      parsed.kind === "timeout" ||
      parsed.kind === "server" ||
      (parsed.kind === "unknown" && (parsed.status === undefined || parsed.status >= 500))
    );
  }

  private static kindFromStatus(status: number): ApiErrorKind {
    if (status === 400) return "validation";
    if (status === 401) return "unauthorized";
    if (status === 403) return "forbidden";
    if (status === 404) return "not_found";
    if (status === 409) return "conflict";
    if (status >= 500) return "server";
    return "unknown";
  }

  private static messageFromApiError(error: ApiErrorResponse): string {
    if (error.errors?.length) {
      return error.errors.map((e) => `${e.field}: ${e.message}`).join(". ");
    }
    return error.message || DEFAULT_MESSAGE;
  }
}
