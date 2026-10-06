/**
 * Storefront Logo Component
 * Used in storefront header for branding with visual logo badge
 */

import React from 'react';
import Link from 'next/link';
import { StorefrontIcon } from '@ecommerce/shared';

interface StorefrontLogoProps {
  href?: string;
  appName?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 20, badge: 32, text: 'text-sm' },
  md: { icon: 24, badge: 40, text: 'text-base' },
  lg: { icon: 28, badge: 48, text: 'text-lg' },
};

export const StorefrontLogo: React.FC<StorefrontLogoProps> = ({
  href = '/',
  appName = 'ShopSwift',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizes = sizeMap[size];
  
  return (
    <Link href={href} className={`flex items-center gap-2.5 hover:opacity-85 transition-opacity ${className}`}>
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

StorefrontLogo.displayName = 'StorefrontLogo';
