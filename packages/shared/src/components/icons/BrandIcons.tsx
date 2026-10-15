/**
 * Custom Brand Icons for E-Commerce Application
 * Centralized icon components with consistent styling
 */

import React from 'react';

/**
 * Props accepted by every brand icon.
 *
 * @remarks
 * Extends the standard SVG element attributes, so `className`, `style` and
 * ARIA attributes pass through to the rendered `<svg>` alongside `size`.
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Rendered width and height in pixels.
   *
   * @remarks
   * Defaults to `24` for every icon except {@link LogoIcon}, which defaults to `32`.
   */
  size?: number;
  /** Extra class names merged onto the underlying `<svg>` element. */
  className?: string;
}

/**
 * Renders the admin-dashboard icon: a four-tile grid symbol.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <AdminIcon size={20} className="text-primary" />
 * ```
 */
export const AdminIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

/**
 * Renders the storefront icon: a shopping bag symbol.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <StorefrontIcon size={28} />
 * ```
 */
export const StorefrontIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

/**
 * Renders the brand logo mark: a gradient rounded square with the "EC" monogram.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <LogoIcon size={36} aria-label="ShopSwift" />
 * ```
 */
export const LogoIcon: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="logoBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="32" height="32" fill="url(#logoBrandGrad)" rx="8" />
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="18"
      fontWeight="bold"
      fill="white"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      EC
    </text>
  </svg>
);

/**
 * Renders the product icon: a card outline with an image placeholder.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <ProductIcon size={20} />
 * ```
 */
export const ProductIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <circle cx="12" cy="9" r="2" />
    <path d="M6 17h12" />
  </svg>
);

/**
 * Renders the category icon: four overlapping circles.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CategoryIcon size={20} />
 * ```
 */
export const CategoryIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <circle cx="7" cy="7" r="5" />
    <circle cx="17" cy="7" r="5" />
    <circle cx="7" cy="17" r="5" />
    <circle cx="17" cy="17" r="5" />
  </svg>
);

/**
 * Renders the orders icon: a report sheet with an upward arrow.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <OrdersIcon size={20} />
 * ```
 */
export const OrdersIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M9 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-5L9 2z" />
    <polyline points="16 13 12 9 8 13" />
  </svg>
);

/**
 * Renders the customers icon: a two-person group symbol.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CustomersIcon size={20} />
 * ```
 */
export const CustomersIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/**
 * Renders the analytics icon: an axis with a rising trend line.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <AnalyticsIcon size={20} className="text-muted-foreground" />
 * ```
 */
export const AnalyticsIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5H17" />
    <polyline points="22 7 18 11 22 15" />
  </svg>
);

/**
 * Renders the settings icon: a cog/gear symbol.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <SettingsIcon size={20} />
 * ```
 */
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
  </svg>
);

/**
 * Renders the cart icon: a shopping cart symbol.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CartIcon size={20} aria-label="Cart" />
 * ```
 */
export const CartIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

/**
 * Renders the wishlist icon: a heart outline.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <WishlistIcon size={20} />
 * ```
 */
export const WishlistIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/**
 * Renders the search icon: a magnifier symbol.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <SearchIcon size={18} className="text-muted-foreground" />
 * ```
 */
export const SearchIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

/**
 * Renders the menu icon: three stacked horizontal lines.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <MenuIcon size={24} aria-label="Open menu" />
 * ```
 */
export const MenuIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/**
 * Renders the close icon: an X symbol.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CloseIcon size={24} aria-label="Close" />
 * ```
 */
export const CloseIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Renders the chevron-right icon: an arrow pointing right.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <ChevronRightIcon size={16} />
 * ```
 */
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/**
 * Renders the check icon: a checkmark symbol.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CheckIcon size={16} className="text-primary" />
 * ```
 */
export const CheckIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Map of all brand icons keyed by lowercase name.
 *
 * @remarks
 * Convenient for rendering an icon from configuration or a lookup value, e.g.
 * `const Icon = icons[config.iconKey]`. Every key points at the component of
 * the same name exported from this module.
 */
export const icons = {
  admin: AdminIcon,
  storefront: StorefrontIcon,
  logo: LogoIcon,
  product: ProductIcon,
  category: CategoryIcon,
  orders: OrdersIcon,
  customers: CustomersIcon,
  analytics: AnalyticsIcon,
  settings: SettingsIcon,
  cart: CartIcon,
  wishlist: WishlistIcon,
  search: SearchIcon,
  menu: MenuIcon,
  close: CloseIcon,
  chevronRight: ChevronRightIcon,
  check: CheckIcon,
} as const;
