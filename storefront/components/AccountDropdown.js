import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { signOut as nextSignOut, signIn } from "next-auth/react"; // Import for signIn
import Link from "next/link"; // Import for Link
import { useState } from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AccountDropdown({
  isSignedIn,
  handleOpenSignInModal,
  handleOpenSignUpModal,
}) {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { toast } = useToast();

  const handleSignIn = async () => {
    const response = await signIn("credentials", {
      redirect: false,
      email: signInData.email,
      password: signInData.password,
    });

    if (response.status === 200) {
      toast({
        title: "Sign-in successful!",
        description: "You have successfully signed in.",
        style: {
          backgroundColor: "#4CAF50",
          color: "#FFFFFF",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "16px",
        },
      });
    } else if (response.status === 401) {
      toast({
        title: "Sign-in failed!",
        description: "Wrong credentials",
        variant: "destructive",
      });
    } else if (response.status === 404) {
      toast({
        title: "Sign-in failed!",
        description: "User not found",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sign-in failed!",
        description: "An error occurred while signing in",
        variant: "destructive",
      });
    }
    setIsSignInModalOpen(false);
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post("/api/auth/create-user", signUpData);
      console.log(response);

      if (response.status === 201) {
        toast({
          title: "Account created successfully!",
          description: "Please continue your shopping",
          style: {
            backgroundColor: "#4CAF50",
            color: "#FFFFFF",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "16px",
          },
        });
      } else if (response.status === 401) {
        toast({
          title: "Sign-in failed!",
          description: "Wrong credentials",
          variant: "destructive",
        });
      } else if (response.status === 404) {
        toast({
          title: "Sign-in failed!",
          description: "User not found",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign-in failed!",
          description: "An error occurred while signing in",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSignUpModalOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="py-2 md:py-0 hover:text-white cursor-pointer bg-green-600">
            {!isSignedIn ? "Account" : "My Account"}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={10}
          className="bg-gray-800 text-white"
        >
          {!isSignedIn ? (
            <>
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => setIsSignInModalOpen(true)}
                  className="hover:bg-gray-700 px-4 py-2 block"
                >
                  Sign In
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="hover:bg-gray-700 px-4 py-2 block"
                >
                  Sign Up
                </Button>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href="/my-account"
                  className="hover:bg-gray-700 px-4 py-2 block"
                >
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/my-orders"
                  className="hover:bg-gray-700 px-4 py-2 block"
                >
                  My Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => nextSignOut()}
                  className="hover:bg-gray-700 px-4 py-2 block"
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sign In Modal */}
      <Dialog open={isSignInModalOpen} onOpenChange={setIsSignInModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Please enter your credentials to sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 p-4">
            <Input
              type="email"
              placeholder="Email"
              value={signInData.email}
              onChange={(e) =>
                setSignInData({ ...signInData, email: e.target.value })
              }
            />
            <Input
              type="password"
              placeholder="Password"
              value={signInData.password}
              onChange={(e) =>
                setSignInData({ ...signInData, password: e.target.value })
              }
            />
            <Button
              className="bg-blue-600 text-white text-center flex justify-center items-center"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </div>
          <a href="/forgot-password">Forgot Password</a>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={isSignUpModalOpen} onOpenChange={setIsSignUpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>
              Fill in the details to create your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 p-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={signUpData.name}
              onChange={(e) =>
                setSignUpData({ ...signUpData, name: e.target.value })
              }
            />
            <Input
              type="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
            />
            <Input
              type="password"
              placeholder="Password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
            />
            <Button
              className="bg-blue-600 text-white text-center flex justify-center items-center"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
