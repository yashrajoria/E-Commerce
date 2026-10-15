"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "../../utils";

/**
 * Renders a circular avatar container that clips its content.
 *
 * @remarks
 * Client Component — declares `"use client"`. Built on Radix UI's avatar
 * primitive; pair it with {@link AvatarImage} and {@link AvatarFallback}.
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
 *   <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
 * </Avatar>
 * ```
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the avatar image, waiting for the source to load before revealing it.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <AvatarImage src="/avatars/ada.png" alt="Ada Lovelace" />
 * ```
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

/**
 * Renders fallback content shown while {@link AvatarImage} loads or when it fails.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <AvatarFallback>AL</AvatarFallback>
 * ```
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
