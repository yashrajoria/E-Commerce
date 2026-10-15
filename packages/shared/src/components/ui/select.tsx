"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "../../utils";

/**
 * Renders the root of a select control, owning open state and selected value.
 *
 * @remarks
 * Client Component — declares `"use client"`. Built on Radix UI's select
 * primitive; compose it with {@link SelectTrigger}, {@link SelectValue} and
 * {@link SelectContent}.
 *
 * @example
 * ```tsx
 * <Select value={category} onValueChange={setCategory}>
 *   <SelectTrigger className="w-40">
 *     <SelectValue placeholder="All categories" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="books">Books</SelectItem>
 *     <SelectItem value="toys">Toys</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

/**
 * Groups {@link SelectItem}s behind an optional {@link SelectLabel}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <SelectGroup>
 *   <SelectLabel>Status</SelectLabel>
 *   <SelectItem value="active">Active</SelectItem>
 * </SelectGroup>
 * ```
 */
function SelectGroup(
  props: React.ComponentProps<typeof SelectPrimitive.Group>,
) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

/**
 * Renders the selected value, or its placeholder, inside a {@link SelectTrigger}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <SelectValue placeholder="All categories" />
 * ```
 */
function SelectValue(
  props: React.ComponentProps<typeof SelectPrimitive.Value>,
) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

/** Props accepted by {@link SelectTrigger}. */
type SelectTriggerProps = React.ComponentProps<
  typeof SelectPrimitive.Trigger
> & {
  /**
   * Control height preset.
   *
   * @defaultValue "default"
   */
  size?: "sm" | "default";
};

/**
 * Renders the button that opens the select and displays the current value.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <SelectTrigger size="sm" className="w-40">
 *   <SelectValue placeholder="Select a category" />
 * </SelectTrigger>
 * ```
 */
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/**
 * Renders the popover listbox in a portal, with scroll affordances.
 *
 * @remarks
 * Client Component — declares `"use client"`. Defaults to the `popper`
 * position so the list is offset from the trigger.
 *
 * @example
 * ```tsx
 * <SelectContent>
 *   <SelectItem value="books">Books</SelectItem>
 *   <SelectItem value="toys">Toys</SelectItem>
 * </SelectContent>
 * ```
 */
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

/**
 * Renders a non-selectable heading inside a {@link SelectGroup}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <SelectLabel>Status</SelectLabel>
 * ```
 */
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

/**
 * Renders a selectable option, showing a check mark while selected.
 *
 * @remarks
 * Client Component — declares `"use client"`. The `value` prop is required by
 * the underlying Radix item.
 *
 * @example
 * ```tsx
 * <SelectItem value="books">Books</SelectItem>
 * ```
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

/**
 * Renders a divider between select option groups.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <SelectSeparator />
 * ```
 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

/**
 * Renders the scroll-up affordance shown when the list overflows.
 *
 * @remarks
 * Client Component — declares `"use client"`. Rendered automatically by
 * {@link SelectContent}; rarely used directly.
 *
 * @example
 * ```tsx
 * <SelectScrollUpButton />
 * ```
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

/**
 * Renders the scroll-down affordance shown when the list overflows.
 *
 * @remarks
 * Client Component — declares `"use client"`. Rendered automatically by
 * {@link SelectContent}; rarely used directly.
 *
 * @example
 * ```tsx
 * <SelectScrollDownButton />
 * ```
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
