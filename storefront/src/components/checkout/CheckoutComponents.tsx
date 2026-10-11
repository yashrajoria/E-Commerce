import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil } from "lucide-react";
import React from "react";
import { ShippingDetails } from "./checkoutTypes";

export const ProgressDots = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
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
}: {
  name: keyof ShippingDetails;
  label: string;
  icon: React.ElementType;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
  value?: string;
  error?: string;
  isTouched?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}) => {
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

export const CompletedCard = (props: {
  step?: number;
  title: string;
  summary: React.ReactNode;
  isEditing?: boolean;
  onEditToggle?: () => void;
  icon?: React.ElementType;
}) => {
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
            <p className="font-medium text-xs text-foreground">
              {title}
            </p>
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
