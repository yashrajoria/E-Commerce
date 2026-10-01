export type CustomerRole = "admin" | "user";

/**
 * Raw shape returned by `GET /bff/admin/users` (identity-service
 * `GetAllUsers`). Everything the admin panel knows about a customer comes
 * from these fields — there is no order/spend aggregate behind this route.
 */
export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  phone_number?: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  role: CustomerRole;
  phone?: string;
  createdAt: string;
}

export type CustomerSortKey = "name" | "email" | "role" | "createdAt";

export interface CustomerFilter {
  search: string;
  role: CustomerRole | "all";
  sortBy: CustomerSortKey;
  sortOrder: "asc" | "desc";
}

export interface CustomerMeta {
  page?: number;
  page_size?: number;
  total?: number;
  total_pages?: number;
}
