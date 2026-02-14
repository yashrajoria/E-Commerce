export type CustomerStatus = "active" | "inactive" | "blocked";

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  type: "billing" | "shipping";
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  averageOrderValue: number;
  joinedDate: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: CustomerStatus;
  addresses: CustomerAddress[];
  stats: CustomerStats;
  notes?: string;
  tags?: string[];
}

export interface CustomerFilter {
  search: string;
  status: CustomerStatus | "all";
  sortBy: "name" | "totalOrders" | "totalSpent" | "lastOrder" | "joinedDate";
  sortOrder: "asc" | "desc";
}
