"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * Renders the Radix dialog root that owns the open state.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogTrigger asChild>
 *     <Button>Edit product</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Edit product</DialogTitle>
 *       <DialogDescription>Update the product details below.</DialogDescription>
 *     </DialogHeader>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const Dialog = DialogPrimitive.Root;

/**
 * Renders the element that opens a {@link Dialog}; use `asChild` to delegate to your own button.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <DialogTrigger asChild>
 *   <Button variant="outline">Edit</Button>
 * </DialogTrigger>
 * ```
 */
export const DialogTrigger = DialogPrimitive.Trigger;

/**
 * Renders a {@link Dialog}-independent portal container for dialog content.
 *
 * @remarks
 * Client Component — declares `"use client"`. {@link DialogContent} already portals itself, so
 * this is only needed when composing custom overlay/content trees.
 *
 * @example
 * ```tsx
 * <DialogPortal>
 *   <DialogOverlay />
 * </DialogPortal>
 * ```
 */
export const DialogPortal = DialogPrimitive.Portal;

/**
 * Renders a button that closes the surrounding {@link Dialog}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <DialogClose asChild>
 *   <Button variant="ghost">Cancel</Button>
 * </DialogClose>
 * ```
 */
export const DialogClose = DialogPrimitive.Close;

/**
 * Renders the dimmed backdrop behind a {@link DialogContent}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <DialogPortal>
 *   <DialogOverlay className="bg-black/70" />
 * </DialogPortal>
 * ```
 */
export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * Renders the centred dialog panel inside its own portal and overlay, with a built-in close button.
 *
 * @remarks
 * Client Component — declares `"use client"`. Maximises at `max-w-lg`; pass `className` to change the width.
 *
 * @example
 * ```tsx
 * <DialogContent className="max-w-md">
 *   <DialogHeader>
 *     <DialogTitle>Delete order</DialogTitle>
 *     <DialogDescription>This action cannot be undone.</DialogDescription>
 *   </DialogHeader>
 *   <DialogFooter>
 *     <Button variant="destructive">Delete</Button>
 *   </DialogFooter>
 * </DialogContent>
 * ```
 */
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-background p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * Renders a stacked header block inside a {@link DialogContent}, centred on mobile and left-aligned from `sm`.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <DialogHeader>
 *   <DialogTitle>Edit product</DialogTitle>
 * </DialogHeader>
 * ```
 */
export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

/**
 * Renders the dialog action row, stacked in reverse on mobile and right-aligned from `sm`.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <DialogFooter>
 *   <Button variant="outline">Cancel</Button>
 *   <Button>Save</Button>
 * </DialogFooter>
 * ```
 */
export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

/**
 * Renders the dialog heading wired to Radix's accessible-title association.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <DialogTitle>Delete order</DialogTitle>
 * ```
 */
export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * Renders muted supporting copy below a {@link DialogTitle}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <DialogDescription>This action cannot be undone.</DialogDescription>
 * ```
 */
export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
