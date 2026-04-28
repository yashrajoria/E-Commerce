/**
 * Admin Logo Component
 * Used in header/sidebar for branding with visual badge
 */

import React from 'react';
import Link from 'next/link';
import { LogoIcon } from '@ecommerce/shared';

interface LogoProps {
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

export const Logo: React.FC<LogoProps> = ({
  href = '/dashboard',
  appName = 'E-Commerce',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizes = sizeMap[size];
  
  return (
    <Link href={href} className={`flex items-center gap-2.5 hover:opacity-85 transition-opacity ${className}`}>
      {/* Logo Badge with gradient background */}
      <div 
        className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 shadow-md hover:shadow-lg transition-shadow"
        style={{ width: sizes.badge, height: sizes.badge }}
      >
        <LogoIcon 
          size={sizes.icon}
          className="drop-shadow-sm"
        />
      </div>
      
      {/* App Name */}
      {showText && (
        <div>
          <div className={`font-bold text-foreground ${sizes.text}`}>
            {appName}
          </div>
          <div className="text-xs text-muted-foreground">Admin Panel</div>
        </div>
      )}
    </Link>
  );
};

Logo.displayName = 'Logo';
