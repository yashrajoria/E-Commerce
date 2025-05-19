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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, User } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import OTPVerificationDialog from "./OTPVerificationDialog";
import { motion } from "framer-motion";

const AuthForm = () => {
  const router = useRouter();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    form: "signin" | "signup"
  ) => {
    const { name, value } = e.target;
    if (form === "signin") {
      setSigninData({ ...signinData, [name]: value });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        "/api/auth/sign-in",
        {
          ...signinData,
          role: "admin",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success("Successfully signed in");
      if (res.status === 200) router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/sign-up", {
        ...signupData,
        role: "admin",
      });
      toast.success("Verification email sent");
      setShowOTPVerification(true);
      if (res.status === 200) {
        setShowOTPVerification(false);
        router.push("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Signed in with Google");
    } catch {
      toast.error("Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border-white/10 border rounded-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gradient">
              Authentication
            </CardTitle>
            <CardDescription className="text-center text-white/70">
              Securely access your admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={tab}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(v) => setTab(v as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-primary-foreground"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-primary-foreground"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="signin"
                className="transition-opacity duration-300 ease-in-out"
              >
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
                        placeholder="you@example.com"
                        value={signinData.email}
                        onChange={(e) => handleInputChange(e, "signin")}
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
                        onChange={(e) => handleInputChange(e, "signin")}
                        disabled={isLoading}
                        required
                        className="pl-10 bg-white/5 border-white/10 focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-right text-xs text-muted-foreground">
                    <button
                      type="button"
                      className="hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </button>
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
              </TabsContent>

              <TabsContent
                value="signup"
                className="transition-opacity duration-300 ease-in-out"
              >
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-white/80">
                      Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={signupData.name}
                        onChange={(e) => handleInputChange(e, "signup")}
                        disabled={isLoading}
                        required
                        className="pl-10 bg-white/5 border-white/10 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="signup-email" className="text-white/80">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupData.email}
                        onChange={(e) => handleInputChange(e, "signup")}
                        disabled={isLoading}
                        required
                        className="pl-10 bg-white/5 border-white/10 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 relative">
                    <Label htmlFor="signup-password" className="text-white/80">
                      Password
                    </Label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={(e) => handleInputChange(e, "signup")}
                        disabled={isLoading}
                        required
                        className="pl-10 bg-white/5 border-white/10 focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
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
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs text-muted-foreground">
                <span className="px-2 bg-card">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={handleGoogleAuth}
              className="w-full text-white border-white/10 hover:bg-white/10"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col text-center text-muted-foreground text-sm pb-6 px-8">
            <p className="flex items-center justify-center gap-1">
              <LockKeyhole size={14} className="text-primary" />
              Protected by enterprise-grade security
            </p>
          </CardFooter>
        </Card>
      </motion.div>

      <OTPVerificationDialog
        open={showOTPVerification}
        onClose={() => {
          setShowOTPVerification(false);
          router.push("/dashboard");
        }}
        email={signupData.email}
      />
    </>
  );
};

export default AuthForm;
