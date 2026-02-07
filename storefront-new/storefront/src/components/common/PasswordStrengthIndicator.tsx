"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { validatePassword, type PasswordValidation } from "@/lib/auth";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const validation: PasswordValidation = validatePassword(password);

  const getStrengthColor = () => {
    if (!password) return "bg-gray-200";
    if (validation.strength === "strong") return "bg-green-500";
    if (validation.strength === "medium") return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStrengthWidth = () => {
    if (!password) return "0%";
    if (validation.strength === "strong") return "100%";
    if (validation.strength === "medium") return "66%";
    return "33%";
  };

  const getStrengthLabel = () => {
    if (!password) return "";
    if (validation.strength === "strong") return "Strong";
    if (validation.strength === "medium") return "Medium";
    return "Weak";
  };

  const requirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One lowercase letter", met: /[a-z]/.test(password) },
    { text: "One number", met: /[0-9]/.test(password) },
    {
      text: "One special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Password Strength
          </span>
          {password && (
            <span
              className={`text-xs font-medium ${
                validation.strength === "strong"
                  ? "text-green-600"
                  : validation.strength === "medium"
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {getStrengthLabel()}
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: getStrengthWidth() }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              {req.met ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-gray-400" />
              )}
              <span
                className={req.met ? "text-green-600" : "text-muted-foreground"}
              >
                {req.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Warning if validation fails */}
      {!validation.isValid && password.length > 0 && (
        <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            Your password doesn&apos;t meet all security requirements
          </p>
        </div>
      )}
    </div>
  );
}
