import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAdminSession } from "@/lib/useAdminSession";

/**
 * Standalone email/password admin sign-in card.
 * Prefer AuthModal on the landing page for the primary UX.
 */
const AuthForm = () => {
  const router = useRouter();
  const { refresh: refreshAdminSession } = useAdminSession();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signinData, setSigninData] = useState({ email: "", password: "" });

  const getErrorMessage = (err: unknown) => {
    if (axios.isAxiosError(err))
      return err.response?.data?.message ?? err.response?.data?.error ?? err.message;
    if (err instanceof Error) return err.message;
    return String(err);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        "/api/admin/auth/login",
        { ...signinData },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      const role = String(res.data?.user?.role || "").toLowerCase();
      if (role && role !== "admin") {
        toast.error("Admin role required");
        await axios
          .post("/api/admin/auth/logout", {}, { withCredentials: true })
          .catch(() => undefined);
        return;
      }

      const status = await axios.get("/api/admin/auth/status", {
        withCredentials: true,
      });
      if (String(status.data?.user?.role || "").toLowerCase() !== "admin") {
        toast.error("Admin role required");
        await axios
          .post("/api/admin/auth/logout", {}, { withCredentials: true })
          .catch(() => undefined);
        return;
      }

      // Refresh _app session before navigating — otherwise stale isAdmin=false
      // immediately bounces /dashboard back to /?error=admin_required.
      await refreshAdminSession();
      toast.success("Successfully signed in");
      await router.push("/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border-white/10 border rounded-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gradient">
            Admin sign in
          </CardTitle>
          <CardDescription className="text-center text-white/70">
            Use the seeded ADMIN_EMAIL account. Self-registration is disabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="signin-email" className="text-white/80">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={signinData.email}
                  onChange={(e) =>
                    setSigninData({ ...signinData, email: e.target.value })
                  }
                  disabled={isLoading}
                  required
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="signin-password" className="text-white/80">
                Password
              </Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={signinData.password}
                  onChange={(e) =>
                    setSigninData({ ...signinData, password: e.target.value })
                  }
                  disabled={isLoading}
                  required
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          Additional admins are invited after you sign in.
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
