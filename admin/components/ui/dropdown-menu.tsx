import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Renders the Radix dropdown menu root that owns open state and item navigation.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Compose it with `DropdownMenuTrigger` and `DropdownMenuContent`.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <Button variant="ghost">Actions</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent align="end">
 *     <DropdownMenuItem>Edit</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/**
 * Renders dropdown content into a document-level portal, escaping ancestor overflow and stacking contexts.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. `DropdownMenuContent` already portals itself.
 *
 * @example
 * ```tsx
 * <DropdownMenuPortal>
 *   <DropdownMenuSubContent>…</DropdownMenuSubContent>
 * </DropdownMenuPortal>
 * ```
 */
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

/**
 * Renders the button that toggles its {@link DropdownMenu}, forwarding props to a `Slot` when `asChild` is set.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuTrigger asChild>
 *   <Button variant="outline" size="icon">
 *     <MoreHorizontal />
 *   </Button>
 * </DropdownMenuTrigger>
 * ```
 */
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

/**
 * Renders the portalled, animated panel holding the menu items.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Size is capped by the available viewport height reported by Radix.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent align="end" className="w-48">
 *   <DropdownMenuItem>Duplicate</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * Groups related {@link DropdownMenuItem}s so labels and arrow-key navigation stay scoped.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuGroup>
 *   <DropdownMenuLabel>Order</DropdownMenuLabel>
 *   <DropdownMenuItem>Print invoice</DropdownMenuItem>
 * </DropdownMenuGroup>
 * ```
 */
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

/** Props accepted by {@link DropdownMenuItem}; adds indentation and tone options to the Radix item props. */
type DropdownMenuItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Item
> & {
  /**
   * Indents the item to align with checkbox and radio rows.
   *
   * @defaultValue false
   */
  inset?: boolean;
  /**
   * Visual tone of the item; `destructive` renders it in the danger colour.
   *
   * @defaultValue "default"
   */
  variant?: "default" | "destructive";
};

/**
 * Renders a single actionable row in a {@link DropdownMenuContent}.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
 *   Delete order
 * </DropdownMenuItem>
 * ```
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a toggleable row that shows a check icon while `checked` is true.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Use inside a controlled parent that updates `checked` from `onCheckedChange`.
 *
 * @example
 * ```tsx
 * <DropdownMenuCheckboxItem
 *   checked={showArchived}
 *   onCheckedChange={setShowArchived}
 * >
 *   Show archived
 * </DropdownMenuCheckboxItem>
 * ```
 */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/**
 * Groups mutually exclusive {@link DropdownMenuRadioItem}s under one selected value.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
 *   <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
 * </DropdownMenuRadioGroup>
 * ```
 */
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

/**
 * Renders a radio row that shows a filled circle while selected.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
 * ```
 */
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/** Props accepted by {@link DropdownMenuLabel}; adds indentation to the Radix label props. */
type DropdownMenuLabelProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Label
> & {
  /**
   * Indents the label to align with checkbox and radio rows.
   *
   * @defaultValue false
   */
  inset?: boolean;
};

/**
 * Renders a non-selectable section label inside a {@link DropdownMenuContent}.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuLabel>Bulk actions</DropdownMenuLabel>
 * ```
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a horizontal divider between menu sections.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuSeparator />
 * ```
 */
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

/**
 * Renders the right-aligned keyboard hint of a menu item, e.g. `⌘D`.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>
 *   Duplicate
 *   <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * ```
 */
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a nested submenu root opened by {@link DropdownMenuSubTrigger}.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>CSV</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 * ```
 */
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/** Props accepted by {@link DropdownMenuSubTrigger}; adds indentation to the Radix sub-trigger props. */
type DropdownMenuSubTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  /**
   * Indents the trigger to align with checkbox and radio rows.
   *
   * @defaultValue false
   */
  inset?: boolean;
};

/**
 * Renders the row that opens a nested submenu, with a trailing chevron.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuSubTrigger inset>Export as</DropdownMenuSubTrigger>
 * ```
 */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

/**
 * Renders the animated panel of a nested submenu.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DropdownMenuSubContent>
 *   <DropdownMenuItem>Export as CSV</DropdownMenuItem>
 *   <DropdownMenuItem>Export as XLSX</DropdownMenuItem>
 * </DropdownMenuSubContent>
 * ```
 */
function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
