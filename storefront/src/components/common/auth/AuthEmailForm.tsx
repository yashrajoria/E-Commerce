"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { PasswordStrengthIndicator } from "../PasswordStrengthIndicator";

export interface AuthEmailFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  fullName: string;
  setFullName: (val: string) => void;
  emailError: string | null;
  passwordError: string | null;
  fullNameError: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
}

export function AuthEmailForm({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  emailError,
  passwordError,
  fullNameError,
  loading,
  onSubmit,
  onClose,
}: AuthEmailFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-5 relative z-10" onSubmit={onSubmit}>
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
            aria-invalid={!!fullNameError}
            aria-describedby={fullNameError ? "fullname-error" : undefined}
          />
          {fullNameError && (
            <p id="fullname-error" className="text-sm text-destructive mt-2" role="alert">
              {fullNameError}
            </p>
          )}
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
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
        </div>
        {emailError && (
          <p id="email-error" className="text-sm text-destructive mt-2" role="alert">
            {emailError}
          </p>
        )}
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
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
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

        {!isLogin && <PasswordStrengthIndicator password={password} />}
      </div>

      {isLogin && (
        <div className="text-right">
          <Button
            variant="link"
            className="p-0 h-auto text-rose-600 hover:text-rose-700"
            asChild
          >
            <Link href="/password/request-reset" onClick={onClose}>
              Forgot password?
            </Link>
          </Button>
        </div>
      )}

      {passwordError && (
        <p id="password-error" className="text-sm text-destructive mt-2" role="alert">
          {passwordError}
        </p>
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
            <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
          </div>
        ) : isLogin ? (
          "Sign In"
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}

