/**
 * Storefront Logo Component
 * Used in storefront header for branding
 */

import React from 'react';
import Link from 'next/link';
import { StorefrontIcon } from '@ecommerce/shared/src/components/icons';

interface StorefrontLogoProps {
  href?: string;
  appName?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 28,
  lg: 32,
};

export const StorefrontLogo: React.FC<StorefrontLogoProps> = ({
  href = '/',
  appName = 'ShopHub',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSize = sizeMap[size];
  
  return (
    <Link href={href} className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`}>
      <StorefrontIcon size={iconSize} className="text-yellow-500" />
      {showText && (
        <div className="font-bold text-foreground">{appName}</div>
      )}
    </Link>
  );
};

StorefrontLogo.displayName = 'StorefrontLogo';
