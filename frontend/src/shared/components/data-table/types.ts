export type SortDirection = "asc" | "desc";

export interface PaginatedTableParams {
  page: number;
  size: number;
  sort: string;
  search?: string;
}

export interface PaginatedTableState extends PaginatedTableParams {
  setPage: (page: number) => void;
  setSort: (sort: string) => void;
  setSearch: (search: string) => void;
  handleSortChange: (field: string) => void;
  getSortDirection: (field: string) => SortDirection | null;
  resetPage: () => void;
}
