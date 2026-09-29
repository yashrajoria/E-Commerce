/**
 * Enhanced Button Component with better accessibility and animations
 * Supports multiple variants, sizes, and states
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 whitespace-nowrap text-sm',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/50 active:scale-95',
        secondary: 'bg-white/10 text-foreground hover:bg-white/20 border border-white/20',
        destructive: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
        outline: 'border border-white/30 text-foreground hover:bg-white/5',
        ghost: 'text-foreground hover:bg-white/5',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
      isLoading: {
        true: 'relative !text-transparent pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, icon, children, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, isLoading }), className)}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
