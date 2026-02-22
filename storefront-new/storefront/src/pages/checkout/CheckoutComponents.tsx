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
              className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                isCompleted
                  ? "w-8 h-8 bg-gradient-to-r from-rose-600 to-amber-500"
                  : isCurrent
                    ? "w-8 h-8 bg-gradient-to-r from-rose-600 to-amber-500 ring-4 ring-rose-500/20"
                    : "w-8 h-8 bg-neutral-200 dark:bg-neutral-700"
              }`}
              layout
            >
              {isCompleted ? (
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              ) : (
                <span
                  className={`text-xs font-bold ${
                    isCurrent
                      ? "text-white"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {step}
                </span>
              )}
            </motion.div>
            {step < total && (
              <div
                className={`w-8 sm:w-12 h-0.5 rounded-full transition-colors duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-r from-rose-600 to-amber-500"
                    : "bg-neutral-200 dark:bg-neutral-700"
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
        className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
      >
        <Icon className="h-4 w-4 text-rose-500" />
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
          className={`h-12 text-base pr-10 transition-all duration-200 rounded-xl border-neutral-200 dark:border-neutral-700 focus:border-rose-500 focus:ring-rose-500/20 ${
            isTouched && error
              ? "border-rose-500 ring-2 ring-rose-500/20"
              : isValid
                ? "border-emerald-400 dark:border-emerald-600"
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
            className="text-sm text-rose-600 dark:text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CompletedCard = ({
  step,
  title,
  summary,
  isEditing,
  onEditToggle,
  icon: Icon,
}: {
  step: number;
  title: string;
  summary: React.ReactNode;
  isEditing?: boolean;
  onEditToggle?: () => void;
  icon?: React.ElementType;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 mb-4"
    >
      <button
        onClick={() => onEditToggle?.()}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={!!isEditing}
        aria-label={`Edit ${title}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            {Icon ? (
              <Icon className="h-4 w-4 text-white" />
            ) : (
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              {title}
            </p>
            {!isEditing && (
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {summary}
              </div>
            )}
          </div>
        </div>
        {onEditToggle ? (
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-sm font-medium">
            <Pencil className="h-3.5 w-3.5" />
            <span>{isEditing ? "Close" : "Edit"}</span>
          </div>
        ) : null}
      </button>
    </motion.div>
  );
};
