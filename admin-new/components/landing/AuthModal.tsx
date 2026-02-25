import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  User,
  Store,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Shield,
  RefreshCcw,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/router";

type AuthView = "login" | "register" | "otp" | "success";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 6) score += 20;
  if (password.length >= 10) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;

  if (score <= 20) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 40) return { score, label: "Fair", color: "bg-orange-500" };
  if (score <= 60) return { score, label: "Good", color: "bg-yellow-500" };
  if (score <= 80) return { score, label: "Strong", color: "bg-emerald-400" };
  return { score, label: "Very Strong", color: "bg-emerald-500" };
}

export default function AuthModal({
  open,
  onClose,
  initialView = "login",
}: AuthModalProps) {
  const router = useRouter();
  const [view, setView] = useState<AuthView>(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Register state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  // OTP state
  const [otpValue, setOtpValue] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Reset when modal opens/closes
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        onClose();
        // Reset after close animation
        setTimeout(() => {
          setView(initialView);
          setLoginData({ email: "", password: "" });
          setRegisterData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            storeName: "",
          });
          setOtpValue("");
          setShowPassword(false);
          setShowConfirmPassword(false);
          setAcceptTerms(false);
        }, 300);
      }
    },
    [onClose, initialView],
  );

  useEffect(() => {
    if (open) setView(initialView);
  }, [open, initialView]);

  const passwordStrength = useMemo(
    () => getPasswordStrength(registerData.password),
    [registerData.password],
  );

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        "/api/auth/login",

        { ...loginData, role: "admin" },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      toast.success("Successfully signed in");
      if (res.status === 200) router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        "/api/auth/register",
        {
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          role: "admin",
        },
        { withCredentials: true },
      );
      toast.success("Verification code sent to your email");
      setView("otp");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        "/api/auth/verify-otp",
        { email: registerData.email, code: otpValue },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      setView("success");
      toast.success("Email verified successfully!");
      setTimeout(() => {
        onClose();
        router.push("/dashboard");
      }, 2500);
    } catch {
      toast.error("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await axios.post("/api/auth/resend-otp", { email: registerData.email });
      setOtpValue("");
      toast.success("New code sent to your email");
    } catch {
      toast.error("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Signed in with Google");
      router.push("/dashboard");
    } catch {
      toast.error("Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-effect-strong border-white/[0.08] rounded-2xl p-0 max-w-md overflow-hidden [&>button]:text-muted-foreground [&>button]:hover:text-foreground">
        <AnimatePresence mode="wait">
          {/* ====== LOGIN VIEW ====== */}
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="h-14 w-14 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                  <LockKeyhole className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in to your admin dashboard
                </p>
              </div>

              {/* Google Button */}
              <Button
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-foreground mb-6"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[hsl(240,14%,8%)] px-3 text-muted-foreground">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      disabled={isLoading}
                      required
                      className="pl-10 h-11 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      disabled={isLoading}
                      required
                      className="pl-10 pr-10 h-11 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 gradient-purple text-white border-0 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-300 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setView("register")}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign up free
                </button>
              </p>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground/50">
                <Shield className="h-3 w-3" />
                Protected by enterprise-grade security
              </div>
            </motion.div>
          )}

          {/* ====== REGISTER VIEW ====== */}
          {view === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="h-14 w-14 rounded-2xl gradient-emerald flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Create your account</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Start your 14-day free trial
                </p>
              </div>

              {/* Google Button */}
              <Button
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-foreground mb-4"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign up with Google
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[hsl(240,14%,8%)] px-3 text-muted-foreground">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      <Input
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                        disabled={isLoading}
                        required
                        className="pl-10 h-10 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Store Name
                    </Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      <Input
                        placeholder="My Store"
                        value={registerData.storeName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            storeName: e.target.value,
                          })
                        }
                        disabled={isLoading}
                        className="pl-10 h-10 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      disabled={isLoading}
                      required
                      className="pl-10 h-10 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Password
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      disabled={isLoading}
                      required
                      className="pl-10 pr-10 h-10 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {/* Password Strength */}
                  {registerData.password && (
                    <div className="flex items-center gap-2 mt-1">
                      <Progress
                        value={passwordStrength.score}
                        className="h-1.5 flex-1 bg-white/[0.05]"
                      />
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.score <= 40
                            ? "text-red-400"
                            : passwordStrength.score <= 60
                              ? "text-yellow-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      disabled={isLoading}
                      required
                      className="pl-10 pr-10 h-10 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {registerData.confirmPassword &&
                    registerData.password !== registerData.confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-white/[0.15] bg-white/[0.03] accent-purple-500"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 gradient-purple text-white border-0 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-300 font-semibold mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-muted-foreground mt-5">
                Already have an account?{" "}
                <button
                  onClick={() => setView("login")}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </motion.div>
          )}

          {/* ====== OTP VERIFICATION VIEW ====== */}
          {view === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {/* Back Button */}
              <button
                onClick={() => setView("register")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-16 w-16 rounded-2xl gradient-blue flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20"
                >
                  <Mail className="h-7 w-7 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold">Verify your email</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  We&apos;ve sent a 6-digit code to
                </p>
                <p className="text-sm text-purple-400 font-medium">
                  {registerData.email}
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center mb-6">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={setOtpValue}
                  disabled={isLoading}
                  aria-label="Enter 6-digit verification code"
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <InputOTPSlot
                        key={idx}
                        index={idx}
                        className="w-12 h-14 text-xl rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 text-center font-bold"
                        aria-label={`Digit ${idx + 1}`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOTP}
                disabled={otpValue.length < 6 || isLoading}
                className="w-full h-11 gradient-purple text-white border-0 rounded-xl shadow-lg shadow-purple-500/20 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              {/* Resend */}
              <div className="text-center mt-4">
                <button
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {isResending ? (
                    <>
                      <RefreshCcw className="h-3 w-3 animate-spin" />
                      Sending new code...
                    </>
                  ) : (
                    "Didn't receive the code? Resend"
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground/50 mt-4">
                Wrong email?{" "}
                <button
                  onClick={() => setView("register")}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Change it
                </button>
              </p>
            </motion.div>
          )}

          {/* ====== SUCCESS VIEW ====== */}
          {view === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-8 py-16 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="h-20 w-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold mb-2"
              >
                Email Verified!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground"
              >
                Your account has been created successfully.
                <br />
                Redirecting to your dashboard...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8"
              >
                <Loader2 className="h-5 w-5 animate-spin text-purple-400 mx-auto" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
