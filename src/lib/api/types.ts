/** Laravel single-resource response */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Laravel paginate() response */
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    path: string;
  };
}

/** Laravel validation error (422) */
export interface ValidationErrors {
  message: string;
  errors: Record<string, string[]>;
}
