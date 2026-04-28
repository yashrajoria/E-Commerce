/**
 * Enhanced type definitions for the E-Commerce application
 * Replaces loose `any` types with proper, type-safe alternatives
 */

// CSV and bulk upload types
export interface CSVRecord {
  [key: string]: string | number | boolean | null;
}

export interface CSVParseResult {
  data: CSVRecord[];
  errors: Array<{
    row: number;
    message: string;
  }>;
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
  };
}

// Image types
export interface UploadedImage {
  id: string;
  url: string;
  publicId: string;
  secure_url: string;
  format: string;
  preview?: string;
  width?: number;
  height?: number;
  bytes?: number;
  created_at?: string;
}

export interface ProductImageData {
  productImages: UploadedImage[];
  thumbnailIndex: number;
}

// Form and validation types
export interface FormErrors {
  [field: string]: string | string[];
}

export interface FieldError {
  field: string;
  message: string;
}

// Dashboard data
export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
  }>;
  customerInsights: {
    newCustomers: number;
    returningCustomers: number;
    churnRate: number;
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and search types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  sortBy?: 'relevance' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

// Component state types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Array and list types
export interface ListItem {
  id: string | number;
  label: string;
}

export interface SelectOption extends ListItem {
  disabled?: boolean;
  icon?: React.ReactNode;
}

// Checkout and cart types
export interface CartItemData {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  image?: string;
}

export interface CheckoutStep {
  id: string;
  title: string;
  completed: boolean;
}

// Notification types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
