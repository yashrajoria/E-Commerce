/**
 * Logo Component
 * Used in header/sidebar for branding
 */

import React from 'react';
import Link from 'next/link';
import { LogoIcon } from '@ecommerce/shared/src/components/icons';

interface LogoProps {
  href?: string;
  appName?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 28,
  md: 32,
  lg: 40,
};

export const Logo: React.FC<LogoProps> = ({
  href = '/dashboard',
  appName = 'E-Commerce',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSize = sizeMap[size];
  
  return (
    <Link href={href} className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`}>
      <LogoIcon size={iconSize} />
      {showText && (
        <div>
          <div className="font-bold text-sm text-foreground">
            {appName}
          </div>
          <div className="text-xs text-muted-foreground">Admin Panel</div>
        </div>
      )}
    </Link>
  );
};

Logo.displayName = 'Logo';
