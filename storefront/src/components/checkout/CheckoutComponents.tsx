import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil } from "lucide-react";
import React from "react";
import { ShippingDetails } from "./checkoutTypes";

/** Props accepted by {@link ProgressDots}. */
interface ProgressDotsProps {
  /** One-based index of the step the user is currently on. */
  current: number;
  /** Total number of steps in the wizard. */
  total: number;
}

/**
 * Renders a compact progress indicator for the checkout wizard.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <ProgressDots current={currentStep} total={4} />
 * ```
 */
export const ProgressDots = ({ current, total }: ProgressDotsProps) => {
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isCompleted = current > step;
        const isCurrent = current === step;
        return (
          <div key={step} className="flex items-center gap-2">
            <motion.div
              className={`flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 ${
                isCompleted
                  ? "w-7 h-7 bg-foreground text-background"
                  : isCurrent
                    ? "w-7 h-7 bg-foreground text-background ring-2 ring-foreground/20"
                    : "w-7 h-7 bg-muted text-muted-foreground"
              }`}
              layout
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <span>{step}</span>
              )}
            </motion.div>
            {step < total && (
              <div
                className={`w-6 sm:w-10 h-0.5 rounded-full transition-colors duration-200 ${
                  isCompleted ? "bg-foreground" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Props accepted by {@link FormField}. */
interface FormFieldProps {
  /** Shipping field this input edits; also used as the DOM `id`/`name`. */
  name: keyof ShippingDetails;
  /** Visible field label. */
  label: string;
  /** Lucide icon rendered beside the label. */
  icon: React.ElementType;
  /**
   * Input type attribute.
   *
   * @defaultValue "text"
   */
  type?: string;
  /** `autocomplete` hint for the browser. */
  autoComplete?: string;
  /** Virtual keyboard hint for mobile devices. */
  inputMode?: "text" | "email" | "tel" | "numeric";
  /** Placeholder text; falls back to {@link FormFieldProps.label}. */
  placeholder?: string;
  /**
   * Controlled input value.
   *
   * @defaultValue ""
   */
  value?: string;
  /** Validation message shown when the field has been touched. */
  error?: string;
  /** Whether the user has interacted with the field; gates the error and success styling. */
  isTouched?: boolean;
  /**
   * Called with the new value on every keystroke.
   *
   * @param value - The input's current value.
   */
  onChange?: (value: string) => void;
  /** Called when the input loses focus. */
  onBlur?: () => void;
}

/**
 * Renders a labelled checkout input with inline validation feedback.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <FormField
 *   name="email"
 *   label="Email Address"
 *   icon={Mail}
 *   type="email"
 *   autoComplete="email"
 *   value={shippingDetails.email}
 *   error={fieldErrors.email}
 *   isTouched={touched.email}
 *   onChange={(v) => handleChange("email", v)}
 *   onBlur={() => handleBlur("email")}
 * />
 * ```
 */
export const FormField = ({
  name,
  label,
  icon: Icon,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  value = "",
  error,
  isTouched,
  onChange,
  onBlur,
}: FormFieldProps) => {
  const isValid = isTouched && !error && value.trim().length > 0;

  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={name}
        className="text-xs font-medium text-foreground flex items-center gap-1.5"
      >
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder ?? label}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          aria-label={label}
          aria-invalid={isTouched && !!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`h-10 text-sm ${
            isTouched && error
              ? "border-destructive ring-1 ring-destructive/30"
              : isValid
                ? "border-border"
                : ""
          }`}
        />
      </div>
      <AnimatePresence>
        {isTouched && error && (
          <motion.p
            id={`${name}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Props accepted by {@link CompletedCard}. */
interface CompletedCardProps {
  /** Wizard step this card summarises. */
  step?: number;
  /** Section title, e.g. `"Shipping Address"`. */
  title: string;
  /** Condensed summary of the completed section, hidden while editing. */
  summary: React.ReactNode;
  /** Whether the section's inline edit panel is open; also drives the button label. */
  isEditing?: boolean;
  /** Toggles the inline edit panel for this section. */
  onEditToggle?: () => void;
  /** Optional icon shown in the leading badge; defaults to a check mark. */
  icon?: React.ElementType;
}

/**
 * Renders a collapsed summary row for a checkout step that has been completed.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <CompletedCard
 *   step={1}
 *   title="Contact"
 *   icon={Mail}
 *   summary={<span>{shippingDetails.email} · {shippingDetails.phone}</span>}
 * />
 * ```
 */
export const CompletedCard = (props: CompletedCardProps) => {
  const { title, summary, isEditing, onEditToggle, icon: Icon } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-surface p-4 mb-3"
    >
      <button
        type="button"
        onClick={() => onEditToggle?.()}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={!!isEditing}
        aria-label={`Edit ${title}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-foreground">
            {Icon ? (
              <Icon className="h-3.5 w-3.5" />
            ) : (
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <p className="font-medium text-xs text-foreground">{title}</p>
            {!isEditing && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {summary}
              </div>
            )}
          </div>
        </div>
        {onEditToggle ? (
          <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors">
            <Pencil className="h-3 w-3" />
            <span>{isEditing ? "Close" : "Edit"}</span>
          </div>
        ) : null}
      </button>
    </motion.div>
  );
};
