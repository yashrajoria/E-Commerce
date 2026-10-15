import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Renders an accessible radio group container built on Radix UI.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router. Accepts and forwards all `React.ComponentProps<typeof RadioGroupPrimitive.Root>` props, such as `value`, `defaultValue`, and `onValueChange`.
 *
 * @example
 * ```tsx
 * <RadioGroup value={plan} onValueChange={setPlan}>
 *   <RadioGroupItem value="monthly" id="monthly" />
 *   <RadioGroupItem value="annual" id="annual" />
 * </RadioGroup>
 * ```
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

/**
 * Renders a selectable radio item with an indicator dot, built on Radix UI.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router. Accepts and forwards all `React.ComponentProps<typeof RadioGroupPrimitive.Item>` props, such as `value`, `checked`, and `disabled`.
 *
 * @example
 * ```tsx
 * <RadioGroupItem value="monthly" id="monthly" />
 * ```
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
