"use client";

import React, { useState } from "react";
import { resetPassword } from "@/pages/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      showSuccess("Password reset successful. Please sign in.");
      router.push("/");
    } catch (err: any) {
      showError(err?.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Set a new password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="code">Verification Code</Label>
          <Input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</Button>
      </form>
    </div>
  );
}
