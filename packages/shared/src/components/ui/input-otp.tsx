"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "../../utils";

/** Props accepted by {@link InputOTP}. */
type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  /** Extra class names applied to the container element that lays out the slots. */
  containerClassName?: string;
};

/**
 * Renders an accessible one-time-password field composed of slot children.
 *
 * @remarks
 * Client Component — declares `"use client"`. Wrap {@link InputOTPSlot} items
 * in {@link InputOTPGroup} and separate groups with
 * {@link InputOTPSeparator}.
 *
 * @example
 * ```tsx
 * <InputOTP maxLength={6} value={code} onChange={setCode}>
 *   <InputOTPGroup>
 *     <InputOTPSlot index={0} />
 *     <InputOTPSlot index={1} />
 *     <InputOTPSlot index={2} />
 *   </InputOTPGroup>
 *   <InputOTPSeparator />
 *   <InputOTPGroup>
 *     <InputOTPSlot index={3} />
 *     <InputOTPSlot index={4} />
 *     <InputOTPSlot index={5} />
 *   </InputOTPGroup>
 * </InputOTP>
 * ```
 */
function InputOTP({
  className,
  containerClassName,
  ...props
}: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

/**
 * Groups {@link InputOTPSlot} children into a single row.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <InputOTPGroup>
 *   <InputOTPSlot index={0} />
 *   <InputOTPSlot index={1} />
 * </InputOTPGroup>
 * ```
 */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

/** Props accepted by {@link InputOTPSlot}. */
type InputOTPSlotProps = React.ComponentProps<"div"> & {
  /** Zero-based position of this slot in the OTP sequence. */
  index: number;
};

/**
 * Renders a single character cell for an {@link InputOTP}.
 *
 * @remarks
 * Client Component — declares `"use client"`. The character, focus ring and
 * blinking caret are read from the surrounding OTP context, so the slot must
 * be rendered inside an {@link InputOTP} of matching `maxLength`.
 *
 * @example
 * ```tsx
 * <InputOTPSlot index={0} />
 * ```
 */
function InputOTPSlot({
  index,
  className,
  ...props
}: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

/**
 * Renders a decorative separator between two OTP groups.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <InputOTPSeparator />
 * ```
 */
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
