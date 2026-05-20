import { describe, expect, it } from "vitest";
import {
  buildPageParams,
  hasActiveFilters,
} from "@/features/books/lib/books-query";
import type { BooksQueryParams } from "@/features/books/types/book";

describe("books-query", () => {
  const base: BooksQueryParams = {
    page: 0,
    size: 12,
    sort: "title,asc",
    status: "ALL",
  };

  it("hasActiveFilters returns false when only pagination set", () => {
    expect(hasActiveFilters(base)).toBe(false);
  });

  it("hasActiveFilters returns true when title filter set", () => {
    expect(hasActiveFilters({ ...base, title: "java" })).toBe(true);
  });

  it("hasActiveFilters ignores ALL status", () => {
    expect(hasActiveFilters({ ...base, status: "ALL" })).toBe(false);
    expect(hasActiveFilters({ ...base, status: "AVAILABLE" })).toBe(true);
  });

  it("buildPageParams omits ALL status and empty strings", () => {
    const params = buildPageParams({
      ...base,
      title: "",
      author: "martin",
      category: undefined,
      status: "ALL",
    });

    expect(params).toEqual({
      page: 0,
      size: 12,
      sort: "title,asc",
      author: "martin",
    });
    expect(params.status).toBeUndefined();
  });

  it("buildPageParams includes AVAILABLE status", () => {
    const params = buildPageParams({ ...base, status: "AVAILABLE" });
    expect(params.status).toBe("AVAILABLE");
  });
});
