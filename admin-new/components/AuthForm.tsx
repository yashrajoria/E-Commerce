import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Mail, Key, Github } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/router";
import OTPVerificationDialog from "./OTPVerificationDialog";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
  });
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value,
    });
  };

  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // This would be a real auth API call in a production app
      // Simulating API delay
      console.log(`${process.env.NEXT_PUBLIC_AUTH_URL}`);
      const res = await axios.post(
        "/api/auth/sign-in",
        {
          email: authData.email,
          password: authData.password,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Successfully signed in");
      if (res.status == 200) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.warning("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This would be a real auth API call in a production app
      // Simulating API delay
      console.log(`${process.env.NEXT_PUBLIC_SIGNUP_URL}`);
      const res = await axios.post("/api/auth/sign-up", {
        email: authData.email,
        password: authData.password,
        role: "admin",
      });
      console.log(res);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Successfully signed in");
      setShowOTPVerification(true);

      if (res.status == 200) {
        setShowOTPVerification(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerificationClose = () => {
    setShowOTPVerification(false);
    router.push("/dashboard");
  };
  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      // This would be a real Google auth API call in a production app
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Successfully signed in with Google");
    } catch (error) {
      console.log(error);
      toast.error("Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Authentication
          </CardTitle>
          <CardDescription className="text-center">
            Securely access your admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="signin-email"
                      className="flex items-center gap-1"
                    >
                      <Mail className="h-3.5 w-3.5" /> Email
                    </Label>
                    <Input
                      id="signin-email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      disabled={isLoading}
                      value={authData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="signin-password"
                      className="flex items-center gap-1"
                    >
                      <Key className="h-3.5 w-3.5" /> Password
                    </Label>
                    <Input
                      id="signin-password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                      disabled={isLoading}
                      value={authData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 w-full"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="flex items-center gap-1">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      disabled={isLoading}
                      value={authData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="signup-email"
                      className="flex items-center gap-1"
                    >
                      <Mail className="h-3.5 w-3.5" /> Email
                    </Label>
                    <Input
                      id="signup-email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      disabled={isLoading}
                      value={authData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="signup-password"
                      className="flex items-center gap-1"
                    >
                      <Key className="h-3.5 w-3.5" /> Password
                    </Label>
                    <Input
                      id="signup-password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                      disabled={isLoading}
                      value={authData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 w-full"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={handleGoogleAuth}
            className="w-full text-white border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Github className="mr-2 h-4 w-4" /> Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col text-center text-muted-foreground text-sm pb-6 px-8">
          <p>
            Protected by enterprise-grade security. We prioritize the protection
            of your data.
          </p>
        </CardFooter>
      </Card>

      <OTPVerificationDialog
        open={showOTPVerification}
        onClose={handleOTPVerificationClose}
        email={authData.email}
      />
    </>
  );
};

// );
// };

// export default AuthForm;
export default AuthForm;
