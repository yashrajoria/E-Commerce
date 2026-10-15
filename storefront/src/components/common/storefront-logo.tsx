/**
 * Storefront branding logo used in the storefront header, pairing a gradient icon badge with the app name.
 */

import React from "react";
import Link from "next/link";
import { StorefrontIcon } from "@ecommerce/shared";

/** Props accepted by {@link StorefrontLogo}. */
interface StorefrontLogoProps {
  /**
   * Link target the logo navigates to.
   *
   * @defaultValue "/"
   */
  href?: string;
  /**
   * Brand name rendered beside the icon when {@link StorefrontLogoProps.showText} is true.
   *
   * @defaultValue "ShopSwift"
   */
  appName?: string;
  /**
   * Controls the badge, icon, and label sizes.
   *
   * @defaultValue "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to render the app name next to the logo badge.
   *
   * @defaultValue true
   */
  showText?: boolean;
  /**
   * Additional classes appended to the root link.
   *
   * @defaultValue ""
   */
  className?: string;
}

const sizeMap = {
  sm: { icon: 20, badge: 32, text: "text-sm" },
  md: { icon: 24, badge: 40, text: "text-base" },
  lg: { icon: 28, badge: 48, text: "text-lg" },
};

/**
 * Renders the ShopSwift logo badge linking to the storefront home page.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <StorefrontLogo appName="ShopSwift" size="md" showText />
 * ```
 */
export const StorefrontLogo: React.FC<StorefrontLogoProps> = ({
  href = "/",
  appName = "ShopSwift",
  size = "md",
  showText = true,
  className = "",
}) => {
  const sizes = sizeMap[size];

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 hover:opacity-85 transition-opacity ${className}`}
    >
      {/* Logo Badge with gradient background */}
      <div
        className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-md hover:shadow-lg transition-shadow"
        style={{ width: sizes.badge, height: sizes.badge }}
      >
        <StorefrontIcon
          size={sizes.icon}
          className="text-white drop-shadow-sm"
        />
      </div>

      {/* App Name */}
      {showText && (
        <div className={`font-bold text-foreground ${sizes.text}`}>
          {appName}
        </div>
      )}
    </Link>
  );
};

StorefrontLogo.displayName = "StorefrontLogo";
