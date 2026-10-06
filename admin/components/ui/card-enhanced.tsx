/**
 * Enhanced Card Component
 * Provides consistent card styling with multiple variants
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-xl border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'glass-effect border-white/10 bg-white/5 hover:bg-white/8',
        elevated: 'glass-effect border-white/15 bg-white/8 shadow-lg shadow-black/20',
        flat: 'bg-white/2 border-white/5',
        outline: 'border-white/20 bg-transparent hover:bg-white/2',
        success: 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10',
        error: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      interactive: {
        true: 'cursor-pointer active:scale-[0.98]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/**
 * Card Header Component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  sticky?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, sticky = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 border-b border-white/10 px-6 py-4',
        sticky && 'sticky top-0 z-10',
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

/**
 * Card Title Component
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-foreground',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * Card Description Component
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * Card Content Component
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/**
 * Card Footer Component
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center border-t border-white/10 px-6 py-3',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
