"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  loginUser,
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  validatePassword,
} from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { trapFocus } from "@/lib/utils";
import { AuthEmailForm } from "./auth/AuthEmailForm";
import { OtpVerificationModal } from "./auth/OtpVerificationModal";

/** Props accepted by {@link LoginModal}. */
interface LoginModalProps {
  /** Whether the modal is rendered. */
  isOpen: boolean;
  /** Unused by this implementation; sign-in state is managed through {@link useUser}. */
  setLoggedIn?: (value: boolean) => void;
  /** Unused by this implementation; sign-in state is managed through {@link useUser}. */
  loggedIn?: boolean;
  /** Called when the user dismisses the modal or a successful sign-in completes. */
  onClose: () => void;
}

/**
 * Renders the sign-in / registration modal and drives the email-password and OTP verification flows.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <LoginModal
 *   isOpen={isLoginModalOpen}
 *   onClose={() => setIsLoginModalOpen(false)}
 * />
 * ```
 */
export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [isOtp, setIsOtp] = useState(false);
  const { showError, showSuccess } = useToast();
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const { refetchUser } = useUser();

  const modalRef = useRef<HTMLDivElement | null>(null);
  const prevFocused = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const onCloseOtp = () => {
    setIsOtp(false);
    setPendingLogin(null);
  };

  useEffect(() => {
    if (isLogin && !isOtp) {
      onCloseOtp();
    }
    if (!isOpen && !isOtp) {
      setPassword("");
      setIsLogin(true);
      setEmailError(null);
      setPasswordError(null);
      setFullNameError(null);
    }
  }, [isLogin, isOpen, isOtp]);

  useEffect(() => {
    if (!isOpen) return;
    prevFocused.current = document.activeElement as HTMLElement;
    setTimeout(() => {
      const first = modalRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(modalRef.current, e);
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      prevFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailError(null);
    setPasswordError(null);
    setFullNameError(null);

    let hasError = false;
    if (email.trim() === "") {
      setEmailError("Please enter your email");
      hasError = true;
    }
    if (password.trim() === "") {
      setPasswordError("Please enter your password");
      hasError = true;
    }
    if (!isLogin && fullName.trim() === "") {
      setFullNameError("Please enter your full name");
      hasError = true;
    }
    if (hasError) {
      showError("Please fix the highlighted fields");
      setLoading(false);
      return;
    }

    // Validate password on registration
    if (!isLogin) {
      const validation = validatePassword(password);
      if (!validation.isValid) {
        showError("Password does not meet security requirements");
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await loginUser(email, password);
        await refetchUser();
        setLoading(false);
        showSuccess("Logged in successfully!");
        onClose();
      } else {
        await registerUser(email, password, fullName);
        setLoading(false);
        setPendingLogin({ email, password });
        setIsOtp(true);
        onClose();
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      setLoading(false);
      console.error("Auth error:", err?.response?.data || err?.message);
      showError(
        err?.response?.data?.error ||
          "Authentication failed. Please try again.",
      );

      if (err?.response?.data?.error === "Email not verified") {
        showError("The email is not verified. Please check your inbox.");
        setPendingLogin({ email, password });
        setIsOtp(true);
        onClose();
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyEmail(email, otpValue);
      if (pendingLogin) {
        await loginUser(pendingLogin.email, pendingLogin.password);
        await refetchUser();
      } else {
        await refetchUser();
      }
      setLoading(false);
      showSuccess("Email verified successfully!");
      onCloseOtp();
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      setLoading(false);
      console.error("OTP verify error:", err?.response?.data || err?.message);
      showError(
        err?.response?.data?.error ||
          "OTP verification failed. Please try again.",
      );
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      await resendVerificationEmail(email);
      showSuccess("Verification code resent successfully!");
      setOtpValue("");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      console.error("Auth error:", err?.response?.data || err?.message);
      showError(
        err?.response?.data?.error ||
          "Failed to resend code. Please try again.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
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
              ref={modalRef}
              className="bg-background/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl w-full max-w-md p-8 relative overflow-hidden"
              initial={
                reduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.9, y: 20 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.9, y: 20 }
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-linear-to-br from-rose-500/5 via-amber-500/5 to-rose-500/5 pointer-events-none" />

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 hover:bg-muted/50 z-10"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="text-center mb-8 relative z-10">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-rose-600 to-amber-500 flex items-center justify-center"
                  initial={reduceMotion ? { scale: 1 } : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { delay: 0.2, type: "spring" }
                  }
                >
                  <Shield className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2 text-gradient-premium">
                  {isLogin ? "Welcome Back" : "Join ShopSwift"}
                </h2>
                <p className="text-muted-foreground">
                  {isLogin
                    ? "Sign in to access your account and continue shopping"
                    : "Create your account and unlock exclusive deals"}
                </p>
              </div>

              <div className="space-y-3 mb-6 relative z-10">
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 hover:border-rose-500/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/50 transition-all duration-200"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative mb-6">
                <Separator className="bg-border/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-background px-4 text-sm text-muted-foreground font-medium">
                    or continue with email
                  </span>
                </div>
              </div>

              <AuthEmailForm
                isLogin={isLogin}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                fullName={fullName}
                setFullName={setFullName}
                emailError={emailError}
                passwordError={passwordError}
                fullNameError={fullNameError}
                loading={loading}
                onSubmit={handleSubmit}
                onClose={onClose}
              />

              <div className="text-center mt-6 relative z-10">
                <span className="text-muted-foreground">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-rose-600 hover:text-rose-700 font-semibold"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <OtpVerificationModal
        isOpen={isOtp}
        email={email}
        otpValue={otpValue}
        setOtpValue={setOtpValue}
        loading={loading}
        resendLoading={resendLoading}
        onClose={onCloseOtp}
        onSubmit={handleOtpSubmit}
        onResend={handleResendCode}
      />
    </>
  );
}
