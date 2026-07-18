import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Loader2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/router";
import { getResponseInfo, getErrorMessage } from "@/lib/error";
import { useAdminSession } from "@/lib/useAdminSession";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  /** @deprecated Public registration is disabled; always shows login. */
  initialView?: "login" | "register";
}

export default function AuthModal({
  open,
  onClose,
}: AuthModalProps) {
  const router = useRouter();
  const { refresh: refreshAdminSession } = useAdminSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        onClose();
        setTimeout(() => {
          setLoginData({ email: "", password: "" });
          setShowPassword(false);
        }, 300);
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    setLoginData({ email: "", password: "" });
    setShowPassword(false);
  }, [open]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        "/api/admin/auth/login",
        { ...loginData },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      const role =
        typeof res.data?.user?.role === "string"
          ? res.data.user.role.toLowerCase()
          : "";
      if (role && role !== "admin") {
        toast.error(
          "Admin role required. This account cannot access the admin panel.",
        );
        await axios
          .post("/api/admin/auth/logout", {}, { withCredentials: true })
          .catch(() => undefined);
        return;
      }

      // Confirm via status (DB-backed role) in case login body is older.
      const status = await axios.get("/api/admin/auth/status", {
        withCredentials: true,
      });
      const statusRole = String(status.data?.user?.role || "").toLowerCase();
      if (statusRole !== "admin") {
        toast.error(
          "Admin role required. This account cannot access the admin panel.",
        );
        await axios
          .post("/api/admin/auth/logout", {}, { withCredentials: true })
          .catch(() => undefined);
        return;
      }

      toast.success("Successfully signed in");
      await refreshAdminSession();
      onClose();
      await router.push("/dashboard");
    } catch (error: unknown) {
      const { data } = getResponseInfo(error);
      const msg =
        typeof data === "object" &&
        data !== null &&
        "message" in (data as Record<string, unknown>)
          ? String((data as Record<string, unknown>).message)
          : getErrorMessage(error) || "Invalid credentials";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-effect-strong border-white/[0.08] rounded-2xl p-0 max-w-md overflow-hidden [&>button]:text-muted-foreground [&>button]:hover:text-foreground">
        <AnimatePresence mode="wait">
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            <div className="text-center mb-8">
              <div className="h-14 w-14 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                <LockKeyhole className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to your admin dashboard
              </p>
            </div>

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
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Password
                </Label>
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

            <p className="text-center text-sm text-muted-foreground mt-6">
              Admin access is invite-only. Use the seeded{" "}
              <span className="text-foreground/80">ADMIN_EMAIL</span> account to
              sign in.
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground/50">
              <Shield className="h-3 w-3" />
              Protected by enterprise-grade security
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
