import * as React from "react";
import { cn } from "../lib/utils";
import { Label } from "../primitives/label";

/** Props accepted by {@link FormField}. */
export interface FormFieldProps {
  /** Label text rendered above the field; the label row is omitted when unset. */
  label?: string;
  /** Validation message; when set it replaces the helper text and is styled as destructive. */
  error?: string;
  /** Supplementary hint shown below the field while `error` is unset. */
  helperText?: string;
  /** Appends a destructive asterisk to the label. */
  required?: boolean;
  /** `id` of the control the label points at, used for the label's `htmlFor` attribute. */
  htmlFor?: string;
  /** The form control to render between the label and the message. */
  children: React.ReactNode;
  /** Extra classes merged onto the wrapping stack. */
  className?: string;
}

/**
 * Renders a labelled form control with helper text and validation messaging.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <FormField label="Email" htmlFor="email" required error={errors.email}>
 *   <Input id="email" type="email" value={email} />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  error,
  helperText,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={htmlFor}>
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </Label>
        </div>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
