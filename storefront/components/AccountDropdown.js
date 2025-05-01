import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogIn, UserPlus, Lock } from "lucide-react";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/router";

export default function AccountDropdown({ open, onOpenChange }) {
  console.log(open);
  const [tab, setTab] = useState("signin");
  // const [confirmPassword, setAuthOpen] = useState(false);
  const [verify, setVerify] = useState(false);
  const [otp, setOtp] = useState("");

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const createUser = async (userData) => {
    try {
      const res = await axios.post("/api/auth/create-user", userData);
      if (res.status === 201) {
        console.log("User created successfully:", res.data);
        onOpenChange(false);
        setVerify(true);
      }
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };
  const router = useRouter();
  const loginUser = async (userData) => {
    try {
      const res = await axios.post("/api/auth/sign-in", userData);
      if (res.status === 200) {
        router.push("/profile");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const verifyUser = async (userData, code) => {
    try {
      const { data } = await axios.post("/api/auth/verify-user", {
        userData,
        code,
      });
      console.log(data);
    } catch (error) {
      console.error("Failed to verify user", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-shop-dark border-none max-w-md w-full rounded-xl p-0 overflow-hidden glass-card">
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className="text-2xl font-bold mb-1">
              {tab === "signin"
                ? "Sign In to ShopSwift"
                : "Create your ShopSwift account"}
            </DialogTitle>
            <DialogDescription className="text-shop-gray text-base mb-2">
              {tab === "signin"
                ? "Welcome back! Please sign in to your account."
                : "Get started with a new account."}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="flex w-full mb-4 bg-shop-dark/70 rounded-lg border border-white/10">
                <TabsTrigger
                  value="signin"
                  className={`flex-1 px-4 py-2 transition font-medium rounded-l-lg ${
                    tab === "signin"
                      ? "bg-shop-purple text-white"
                      : "text-shop-gray hover:bg-shop-purple/20"
                  }`}
                >
                  <LogIn className="inline-block w-4 h-4 mr-1 mb-1" /> Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className={`flex-1 px-4 py-2 transition font-medium rounded-r-lg ${
                    tab === "signup"
                      ? "bg-shop-purple text-white"
                      : "text-shop-gray hover:bg-shop-purple/20"
                  }`}
                >
                  <UserPlus className="inline-block w-4 h-4 mr-1 mb-1" /> Sign
                  Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" forceMount>
                {tab === "signin" && (
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      loginUser(userData);
                      console.log("User data:", userData);
                    }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Email
                      </label>
                      <Input
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                        type="email"
                        required
                        placeholder="Enter your email"
                        className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Password
                      </label>
                      <Input
                        onChange={(e) =>
                          setUserData({ ...userData, password: e.target.value })
                        }
                        type="password"
                        required
                        placeholder="Enter your password"
                        className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-1 bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90 text-white font-medium flex gap-2 items-center justify-center"
                    >
                      <Lock className="w-4 h-4" /> Sign In
                    </Button>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="signup" forceMount>
                {tab === "signup" && (
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      createUser(userData);
                      console.log("User data:", userData);
                    }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Email
                      </label>
                      <Input
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                        type="email"
                        required
                        placeholder="Email address"
                        className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Password
                      </label>
                      <Input
                        onChange={(e) =>
                          setUserData({ ...userData, password: e.target.value })
                        }
                        type="password"
                        required
                        placeholder="Create a password"
                        className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Confirm Password
                      </label>
                      <Input
                        onChange={(e) =>
                          setUserData({ ...userData, password: e.target.value })
                        }
                        type="password"
                        required
                        placeholder="Repeat your password"
                        className="bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-1 bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90 text-white font-medium flex gap-2 items-center justify-center"
                    >
                      <UserPlus className="w-4 h-4" /> Create Account
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
      {verify && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="glass-card bg-shop-dark/95 backdrop-blur-lg border border-white/10 shadow-lg text-white max-w-md w-full rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-2 text-white text-center">
              Verify your Email
            </h2>
            <p className="text-sm text-white/70 mb-6 text-center">
              Enter the 6-digit code we sent to your email to verify your
              account.
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              onClick={() => verifyUser(userData, otp)}
              className="w-full mt-6 bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90 text-white font-medium flex gap-2 items-center justify-center"
            >
              <Lock className="w-4 h-4" /> Verify Account
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
