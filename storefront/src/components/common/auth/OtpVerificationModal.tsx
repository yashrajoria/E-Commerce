"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../ui/input-otp";
import { trapFocus } from "@/lib/utils";

export interface OtpVerificationModalProps {
  isOpen: boolean;
  email: string;
  otpValue: string;
  setOtpValue: (value: string) => void;
  loading: boolean;
  resendLoading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onResend: () => Promise<void>;
}

export function OtpVerificationModal({
  isOpen,
  email,
  otpValue,
  setOtpValue,
  loading,
  resendLoading,
  onClose,
  onSubmit,
  onResend,
}: OtpVerificationModalProps) {
  const otpRef = useRef<HTMLDivElement | null>(null);
  const prevFocused = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    prevFocused.current = document.activeElement as HTMLElement;
    setTimeout(() => {
      const first = otpRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(otpRef.current, e);
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      prevFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={otpRef}
            className="bg-background/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl w-full max-w-sm p-8 relative overflow-hidden"
            initial={reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-rose-500/5 to-amber-500/5 pointer-events-none" />

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 hover:bg-muted/50"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="text-center mb-8 relative z-10">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-emerald-600 to-rose-600 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 bg-linear-to-r from-emerald-600 to-rose-600 bg-clip-text text-transparent">
                Verify Your Email
              </h2>
              <p className="text-muted-foreground text-sm">
                We&apos;ve sent a 6-digit verification code to
              </p>
              <Badge className="mt-2">{email}</Badge>
            </div>

            <div className="space-y-6 flex flex-col relative z-10">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => setOtpValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={onSubmit}
                className="w-full h-12 bg-linear-to-r from-emerald-600 to-rose-600 hover:from-emerald-700 hover:to-rose-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-full"
                disabled={loading || otpValue.length !== 6}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn&apos;t receive the code?
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-rose-600 hover:text-rose-700 font-semibold"
                  onClick={onResend}
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Resend Code"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

