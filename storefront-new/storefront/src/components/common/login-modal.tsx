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
  Badge,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loginUser, registerUser, verifyEmail } from "@/pages/api/auth";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

interface LoginModalProps {
  isOpen: boolean;
  setLoggedIn: (value: boolean) => void;
  loggedIn: boolean;
  onClose: () => void;
}

export function LoginModal({
  isOpen,
  setLoggedIn,
  loggedIn,
  onClose,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isOtp, setIsOtp] = useState(false);
  const { showError, showSuccess } = useToast();
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // setEmail("");
      setPassword("");
      setShowPassword(false);
      setIsLogin(true);
    }

    // Perform login or signup action
  }, [isOpen]);
  const onCloseOtp = () => {
    setIsOtp(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (email == "" || password == "") {
      showError("Please fill all the fields");
      setLoading(false);
      return;
    }
    try {
      if (isLogin) {
        const data = await loginUser(email, password);
        console.log("Login success:", data);
        setLoading(false);
        setLoggedIn(true);
        onClose(); // Login modal close
      } else {
        const data = await registerUser(email, password, fullName);
        console.log("Register success:", data);

        // Simulate delay before switching to OTP modal
        setTimeout(() => {
          setLoading(false);
          onClose(); // Close login modal
          setIsOtp(true); // Open OTP modal
        }, 1000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      console.error("Auth error:", error?.response?.data || error.message);

      if (error?.response?.data?.error == "Email not verified") {
        showError("The email is not verified. Please check your inbox.");
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(email, otpValue);
    const data = await verifyEmail(email, otpValue);
    console.log("Login success:", data);

    setLoading(false);
    showSuccess("Email verified successfully!");
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            >
              {/* Modal */}
              <motion.div
                className="bg-background/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl w-full max-w-md p-8 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5 pointer-events-none" />

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 hover:bg-muted/50 z-10"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Shield className="h-8 w-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {isLogin ? "Welcome Back" : "Join SuperStore"}
                  </h2>
                  <p className="text-muted-foreground">
                    {isLogin
                      ? "Sign in to access your account and continue shopping"
                      : "Create your account and unlock exclusive deals"}
                  </p>
                </div>

                {/* Social Login */}
                <div className="space-y-3 mb-6 relative z-10">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 transition-all duration-200"
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

                {/* Form */}
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
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
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
                    {/* {errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )} */}
                  </div>

                  {isLogin && (
                    <div className="text-right">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-600 hover:text-blue-700"
                      >
                        Forgot password?
                      </Button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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

                {/* Toggle */}
                <div className="text-center mt-6 relative z-10">
                  <span className="text-muted-foreground">
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                  </span>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      // setErrors({});
                    }}
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
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />

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
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <CheckCircle className="h-8 w-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Verify Your Email
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    We&post;ve sent a 6-digit verification code to
                  </p>
                  <Badge className="mt-2">{email}</Badge>
                </div>

                <div className="space-y-6 flex flex-col relative z-10">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={(value) => {
                        setOtpValue(value);
                        // if (errors.otp)
                        //   setErrors((prev) => ({ ...prev, otp: "" }));
                      }}
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
                    className="w-full h-12 p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold"
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
                      Didn&post;t receive the code?
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-700"
                    >
                      Resend Code
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
