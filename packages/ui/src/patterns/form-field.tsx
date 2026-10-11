import * as React from "react";
import { cn } from "../lib/utils";
import { Label } from "../primitives/label";

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

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
