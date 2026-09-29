/**
 * Application Configuration and Constants
 * Centralized settings for UI, API, and business logic
 */

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZES: [10, 20, 50, 100] as const,
} as const;

// Product Configuration
export const PRODUCT_CONFIG = {
  MAX_IMAGES: 10,
  MAX_IMAGE_SIZE_MB: 10,
  MIN_PRICE: 0,
  MAX_PRICE: 1000000,
  IMAGE_FORMATS: ['JPEG', 'PNG', 'WebP', 'GIF'] as const,
} as const;

// Form Configuration
export const FORM_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_INPUT_LENGTH: 500,
  PASSWORD_MIN_LENGTH: 8,
  VALIDATION_ERROR_DELAY: 3000,
} as const;

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 4000,
  MODAL_ANIMATION_DURATION: 300,
  SKELETON_COUNT: {
    LIST: 5,
    GRID: 6,
    CARDS: 4,
  },
} as const;

// Checkout Configuration
export const CHECKOUT_CONFIG = {
  STEPS: [
    { id: 'contact', label: 'Contact' },
    { id: 'address', label: 'Delivery' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ] as const,
  MINIMUM_ORDER_VALUE: 0,
  FREE_SHIPPING_THRESHOLD: 100,
  DEFAULT_CURRENCY: 'USD' as const,
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP'] as const,
} as const;

// Order Configuration
export const ORDER_CONFIG = {
  STATUSES: [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ] as const,
  PAYMENT_STATUSES: [
    'unpaid',
    'paid',
    'refunded',
    'failed',
  ] as const,
  RETURN_WINDOW_DAYS: 30,
} as const;

// User Configuration
export const USER_CONFIG = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_NAME_LENGTH: 100,
  MAX_BIO_LENGTH: 500,
  PROFILE_IMAGE_MAX_SIZE_MB: 5,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  FILTERS: [
    'category',
    'price',
    'rating',
    'inStock',
  ] as const,
  SORT_OPTIONS: [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
  ] as const,
} as const;

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  CHART_COLORS: {
    primary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
  CHART_ANIMATION_DURATION: 1000,
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_AI_ASSISTANT: true,
  ENABLE_BULK_UPLOAD: true,
  ENABLE_ADVANCED_ANALYTICS: true,
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_WISHLIST: true,
  ENABLE_REVIEWS: true,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  DUPLICATE: 'This item already exists.',
  INVALID_FILE: 'Invalid file format.',
  FILE_TOO_LARGE: 'File size is too large.',
  GENERIC: 'An error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',
  DELETED: 'Successfully deleted.',
  SAVED: 'Successfully saved.',
  SUBMITTED: 'Successfully submitted.',
  LOGIN: 'Successfully logged in.',
  LOGOUT: 'Successfully logged out.',
  PASSWORD_CHANGED: 'Password successfully changed.',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/[id]',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ACCOUNT: '/account',
  ORDERS: '/account/orders',
  PROFILE: '/account/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_DASHBOARD: '/dashboard',
  ADMIN_PRODUCTS: '/products',
  ADMIN_CATEGORIES: '/categories',
  ADMIN_ORDERS: '/orders',
  ADMIN_CUSTOMERS: '/customers',
  ADMIN_ANALYTICS: '/analytics',
} as const;

// Email Configuration
export const EMAIL_CONFIG = {
  REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_LENGTH: 5,
  MAX_LENGTH: 254,
} as const;

// Phone Configuration
export const PHONE_CONFIG = {
  REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/,
  MIN_LENGTH: 10,
  MAX_LENGTH: 15,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  CART: 'ecommerce_cart',
  WISHLIST: 'ecommerce_wishlist',
  USER: 'ecommerce_user',
  AUTH_TOKEN: 'ecommerce_auth_token',
  THEME: 'ecommerce_theme',
  PREFERENCES: 'ecommerce_preferences',
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 10 * 60 * 1000, // 10 minutes
  USER: 2 * 60 * 1000, // 2 minutes
  ANALYTICS: 15 * 60 * 1000, // 15 minutes
} as const;

// Rate Limiting
export const RATE_LIMIT = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  API_REQUESTS_PER_MINUTE: 100,
} as const;
