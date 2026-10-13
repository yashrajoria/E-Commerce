import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer } from "@/types/customers";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

interface AddCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<unknown> | unknown;
}

export function AddCustomerModal({
  open,
  onOpenChange,
  onSuccess,
}: AddCustomerModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as Customer["role"],
  });

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post("/api/customers", form);
      if (response.status >= 200 && response.status < 300) {
        toast.success(`${form.name.trim()} added`);
        onOpenChange(false);
        setForm({ name: "", email: "", password: "", role: "user" });
        await onSuccess();
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to create customer";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-effect-strong border-white/[0.08]">
        <DialogHeader>
          <DialogTitle>Add customer</DialogTitle>
          <DialogDescription>
            Creates a ShopSwift account that can sign in straight away.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="customer-name">Full name</Label>
            <Input
              id="customer-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jane Doe"
              className="bg-white/[0.04] border-white/[0.08] rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jane@example.com"
              className="bg-white/[0.04] border-white/[0.08] rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer-password">Temporary password</Label>
            <Input
              id="customer-password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Minimum 8 characters"
              className="bg-white/[0.04] border-white/[0.08] rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) =>
                setForm({ ...form, role: value as Customer["role"] })
              }
            >
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08] rounded-xl">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-white/[0.08]">
                <SelectItem value="user">Customer</SelectItem>
                <SelectItem value="admin">Staff (admin)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-white/[0.08]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={
              isSaving ||
              !form.name.trim() ||
              !form.email.trim() ||
              form.password.length < 8
            }
            className="rounded-xl gradient-purple text-white hover:opacity-90 border-0"
          >
            {isSaving ? "Adding..." : "Add customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
