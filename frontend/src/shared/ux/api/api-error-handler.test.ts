import { describe, expect, it } from "vitest";
import { APIErrorHandler } from "@/shared/ux/api/api-error-handler";
import { ru } from "@/shared/i18n";
import type { ApiErrorResponse } from "@/shared/types/api";

describe("APIErrorHandler", () => {
  it("parses validation errors from API response", () => {
    const error: ApiErrorResponse = {
      timestamp: "2026-01-01T00:00:00Z",
      status: 400,
      error: "Bad Request",
      message: "Validation failed",
      path: "/auth/register",
      errors: [{ field: "email", message: "must be a valid email" }],
    };

    const parsed = APIErrorHandler.parse(error);

    expect(parsed.kind).toBe("validation");
    expect(parsed.message).toContain("email");
    expect(parsed.status).toBe(400);
  });

  it("parses network-style ApiErrorResponse with status 0", () => {
    const error: ApiErrorResponse = {
      timestamp: "2026-01-01T00:00:00Z",
      status: 0,
      error: "Error",
      message: "Network Error",
      path: "/books",
    };

    const parsed = APIErrorHandler.parse(error);

    expect(parsed.kind).toBe("network");
    expect(parsed.message).toBe(ru.errors.network);
  });

  it("maps 500 responses to server kind", () => {
    const error: ApiErrorResponse = {
      timestamp: "2026-01-01T00:00:00Z",
      status: 500,
      error: "Internal Server Error",
      message: "An unexpected error occurred",
      path: "/books",
    };

    const parsed = APIErrorHandler.parse(error);

    expect(parsed.kind).toBe("server");
    expect(parsed.message).toBe("An unexpected error occurred");
  });

  it("maps 401 to unauthorized", () => {
    const error: ApiErrorResponse = {
      timestamp: "2026-01-01T00:00:00Z",
      status: 401,
      error: "Unauthorized",
      message: "Authentication required",
      path: "/books",
    };

    expect(APIErrorHandler.parse(error).kind).toBe("unauthorized");
  });
});
