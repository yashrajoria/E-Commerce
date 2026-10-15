/**
 * Enhanced type definitions for the E-Commerce application
 * Replaces loose `any` types with proper, type-safe alternatives
 */

/** A single CSV row keyed by column header. */
export interface CSVRecord {
  /** Cell value for a column, keyed by its header. */
  [key: string]: string | number | boolean | null;
}

/** Result of parsing a CSV file. */
export interface CSVParseResult {
  /** Successfully parsed rows. */
  data: CSVRecord[];
  /** Row-level problems found while parsing. */
  errors: Array<{
    /** 1-based row number the error refers to. */
    row: number;
    /** Description of the problem. */
    message: string;
  }>;
  /** Parser metadata describing the detected format. */
  meta: {
    /** Detected field delimiter. */
    delimiter: string;
    /** Detected line-ending sequence. */
    linebreak: string;
    /** Whether parsing stopped before completion. */
    aborted: boolean;
    /** Whether the parser dropped rows after hitting a limit. */
    truncated: boolean;
    /** Parser cursor position when parsing finished. */
    cursor: number;
  };
}

/** Metadata for an image uploaded through the product image pipeline. */
export interface UploadedImage {
  /** Unique id assigned by the media host. */
  id: string;
  /** Delivery URL for the image. */
  url: string;
  /** Media host's public identifier for the asset. */
  publicId: string;
  /** HTTPS delivery URL for the image. */
  secure_url: string;
  /** File format extension, e.g. `"webp"`. */
  format: string;
  /** Local preview URL shown before the upload completes. */
  preview?: string;
  /** Intrinsic image width in pixels. */
  width?: number;
  /** Intrinsic image height in pixels. */
  height?: number;
  /** File size in bytes. */
  bytes?: number;
  /** ISO timestamp of the upload. */
  created_at?: string;
}

/** Images attached to a product together with the selected thumbnail. */
export interface ProductImageData {
  /** Images currently attached to the product. */
  productImages: UploadedImage[];
  /** Index of the image used as the product thumbnail. */
  thumbnailIndex: number;
}

/** Validation messages keyed by form field name. */
export interface FormErrors {
  /** One or more messages for a field; absent when the field is valid. */
  [field: string]: string | string[];
}

/** A single field-level validation error. */
export interface FieldError {
  /** Name of the invalid field. */
  field: string;
  /** Message describing the problem. */
  message: string;
}

/** Aggregate sales metrics rendered on the admin dashboard. */
export interface DashboardMetrics {
  /** Total revenue for the reported period. */
  totalRevenue: number;
  /** Total number of orders. */
  totalOrders: number;
  /** Total number of customers. */
  totalCustomers: number;
  /** Conversion rate for the reported period. */
  conversionRate: number;
  /** Average order value. */
  averageOrderValue: number;
  /** Best-performing products with sales and revenue. */
  topProducts: Array<{
    /** Product identifier. */
    id: string;
    /** Product display name. */
    name: string;
    /** Units sold. */
    sales: number;
    /** Revenue attributed to the product. */
    revenue: number;
  }>;
  /** Most recent orders. */
  recentOrders: Array<{
    /** Order identifier. */
    id: string;
    /** Customer name shown in the list. */
    customerName: string;
    /** Order amount. */
    amount: number;
    /** Order status label. */
    status: string;
    /** Order date string. */
    date: string;
  }>;
  /** Customer retention indicators. */
  customerInsights: {
    /** Customers acquired in the period. */
    newCustomers: number;
    /** Customers with repeat orders. */
    returningCustomers: number;
    /** Churn rate for the reported period. */
    churnRate: number;
  };
}

/** Standard response envelope returned by the backend APIs. */
export interface ApiResponse<T = unknown> {
  /** Whether the request succeeded. */
  success: boolean;
  /** Response payload, present on success. */
  data?: T;
  /** Error identifier or message when the request failed. */
  error?: string;
  /** Human-readable message accompanying the response. */
  message?: string;
  /** HTTP status code echoed by the backend, when provided. */
  statusCode?: number;
}

/** One page of a paginated list endpoint's results. */
export interface PaginatedResponse<T> {
  /** Items in the current page. */
  items: T[];
  /** Total number of items across all pages. */
  total: number;
  /** 1-based index of the current page. */
  page: number;
  /** Number of items requested per page. */
  pageSize: number;
  /** Total number of pages available. */
  totalPages: number;
}

/** A single selectable filter value. */
export interface FilterOption {
  /** Value submitted when the option is chosen. */
  value: string;
  /** Label shown to the user. */
  label: string;
  /** Number of matching results, when known. */
  count?: number;
  /** Whether the option cannot be selected. */
  disabled?: boolean;
}

/** Normalized search and filtering parameters for product lists. */
export interface SearchFilters {
  /** Free-text search query. */
  query?: string;
  /** Category slug or id restricting the results. */
  category?: string;
  /** Inclusive price bounds. */
  priceRange?: {
    /** Minimum price. */
    min: number;
    /** Maximum price. */
    max: number;
  };
  /** Minimum average rating. */
  rating?: number;
  /** Whether to return only in-stock products. */
  inStock?: boolean;
  /** Field to sort by. */
  sortBy?: 'relevance' | 'price' | 'rating' | 'newest';
  /** Sort direction. */
  sortOrder?: 'asc' | 'desc';
}

/** Minimal async UI state: a loading flag plus an optional error. */
export interface LoadingState {
  /** Whether work is currently in flight. */
  isLoading: boolean;
  /** Error message from the last attempt, or `null` when none. */
  error: string | null;
}

/** {@link LoadingState} extended with the loaded payload. */
export interface AsyncState<T> extends LoadingState {
  /** Loaded data, or `null` before the first successful load. */
  data: T | null;
}

/** Minimal `{ id, label }` pair used by list and select components. */
export interface ListItem {
  /** Stable identifier for the item. */
  id: string | number;
  /** Display label. */
  label: string;
}

/** {@link ListItem} extended with an icon and disabled state for selects. */
export interface SelectOption extends ListItem {
  /** Whether the option cannot be selected. */
  disabled?: boolean;
  /** Optional icon rendered beside the label. */
  icon?: React.ReactNode;
}

/** Minimal cart-line data used outside the cart context. */
export interface CartItemData {
  /** Product identifier. */
  productId: string;
  /** Number of units in the cart. */
  quantity: number;
  /** Unit price in major currency units. */
  price: number;
  /** Product title. */
  title: string;
  /** Product image URL. */
  image?: string;
}

/** One step in a checkout progress indicator. */
export interface CheckoutStep {
  /** Step identifier, e.g. `"payment"`. */
  id: string;
  /** Step label shown to the user. */
  title: string;
  /** Whether the step has been completed. */
  completed: boolean;
}

/** A notification queued for display in the app's toast region. */
export interface Toast {
  /** Unique toast identifier. */
  id: string;
  /** Visual tone of the notification. */
  type: 'success' | 'error' | 'info' | 'warning';
  /** Message content. */
  message: string;
  /** Time in milliseconds before auto-dismissal. */
  duration?: number;
}
