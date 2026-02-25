"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  loginUser,
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  validatePassword,
} from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { useUser } from "@/context/UserContext";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

interface LoginModalProps {
  isOpen: boolean;
  setLoggedIn?: (value: boolean) => void;
  loggedIn?: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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

  useEffect(() => {
    if (isLogin && !isOtp) {
      onCloseOtp();
    }
    if (!isOpen && !isOtp) {
      setPassword("");
      setShowPassword(false);
      setIsLogin(true);
    }
  }, [isLogin, isOpen, isOtp]);

  const onCloseOtp = () => {
    setIsOtp(false);
    setPendingLogin(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (email === "" || password === "" || (!isLogin && fullName === "")) {
      showError("Please fill all the fields");
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
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            >
              <motion.div
                className="bg-background/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl w-full max-w-md p-8 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
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
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Shield className="h-8 w-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-2 text-gradient-premium">
                    {isLogin ? "Welcome Back" : "Join LuxeStore"}
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

                <form
                  className="space-y-5 relative z-10"
                  onSubmit={handleSubmit}
                >
                  {!isLogin && (
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        placeholder="Enter your full name"
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-2 h-12"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="pl-12 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-12 h-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-muted/50"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Password Strength Indicator for Registration */}
                    {!isLogin && (
                      <PasswordStrengthIndicator password={password} />
                    )}
                  </div>

                  {isLogin && (
                    <div className="text-right">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-rose-600 hover:text-rose-700"
                      >
                        Forgot password?
                      </Button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-linear-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>
                          {isLogin ? "Signing in..." : "Creating account..."}
                        </span>
                      </div>
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

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
          </>
        )}
      </AnimatePresence>

      {/* OTP Modal */}
      <AnimatePresence>
        {isOtp && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseOtp}
            >
              <motion.div
                className="bg-background/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl w-full max-w-sm p-8 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-rose-500/5 to-amber-500/5 pointer-events-none" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 hover:bg-muted/50"
                  onClick={onCloseOtp}
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
                        <InputOTPSlot
                          index={0}
                          className="w-12 h-12 text-lg border-2"
                        />
                        <InputOTPSlot
                          index={1}
                          className="w-12 h-12 text-lg border-2"
                        />
                        <InputOTPSlot
                          index={2}
                          className="w-12 h-12 text-lg border-2"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={3}
                          className="w-12 h-12 text-lg border-2"
                        />
                        <InputOTPSlot
                          index={4}
                          className="w-12 h-12 text-lg border-2"
                        />
                        <InputOTPSlot
                          index={5}
                          className="w-12 h-12 text-lg border-2"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    onClick={handleOtpSubmit}
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
                      onClick={handleResendCode}
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
          </>
        )}
      </AnimatePresence>
    </>
  );
}

