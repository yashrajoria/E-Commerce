/** Authorization role of a customer account as understood by the admin panel. */
export type CustomerRole = "admin" | "user";

/**
 * Raw shape returned by `GET /bff/admin/users` (identity-service
 * `GetAllUsers`). Everything the admin panel knows about a customer comes
 * from these fields — there is no order/spend aggregate behind this route.
 */
export interface AdminUserRecord {
  /** Identity-service user id. */
  id: string;
  /** Login email address. */
  email: string;
  /** Display name. */
  name: string;
  /** Raw role string returned by the identity service. */
  role: string;
  /** Optional phone number, `null` when unset. */
  phone_number?: string | null;
  /** ISO timestamp of account creation. */
  created_at: string;
}

/** Customer row rendered by the admin customers table after mapping from {@link AdminUserRecord}. */
export interface Customer {
  /** Identity-service user id. */
  id: string;
  /** Display name. */
  name: string;
  /** Login email address. */
  email: string;
  /** Normalized authorization role. */
  role: CustomerRole;
  /** Optional phone number. */
  phone?: string;
  /** ISO timestamp of account creation. */
  createdAt: string;
}

/** Columns the customers table can be sorted by. */
export type CustomerSortKey = "name" | "email" | "role" | "createdAt";

/** Active search, role and sort state applied to the customers list. */
export interface CustomerFilter {
  /** Free-text query matched against name and email. */
  search: string;
  /** Role to filter by, or `"all"` to include every role. */
  role: CustomerRole | "all";
  /** Column to sort by. */
  sortBy: CustomerSortKey;
  /** Sort direction. */
  sortOrder: "asc" | "desc";
}

/** Pagination metadata returned alongside a page of customers. */
export interface CustomerMeta {
  /** 1-based page number. */
  page?: number;
  /** Number of rows requested per page. */
  page_size?: number;
  /** Total number of matching rows. */
  total?: number;
  /** Total number of pages for the current filter. */
  total_pages?: number;
}
