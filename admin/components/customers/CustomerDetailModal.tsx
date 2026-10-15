import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import type { Customer } from "@/types/customers";
import { AtSign, CalendarDays, Copy, Phone } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { ROLE_LABEL, ROLE_STYLE, initialsOf } from "./CustomersTable";

/** Props accepted by {@link CustomerDetailModal}. */
interface CustomerDetailModalProps {
  /** Customer to display, or `null` to keep the dialog closed. */
  customer: Customer | null;
  /** Called when the dialog is dismissed. */
  onClose: () => void;
}

/**
 * Renders a read-only profile dialog for a customer, including copy-to-clipboard actions.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
 * ```
 */
export function CustomerDetailModal({
  customer,
  onClose,
}: CustomerDetailModalProps) {
  return (
    <Dialog
      open={Boolean(customer)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-lg glass-effect-strong border-white/[0.08]">
        <DialogHeader>
          <DialogTitle>Customer details</DialogTitle>
          <DialogDescription>
            Profile information for this ShopSwift account.
          </DialogDescription>
        </DialogHeader>

        {customer && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="gradient-purple text-white text-base font-semibold">
                  {initialsOf(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-foreground truncate">
                  {customer.name}
                </p>
                <Badge
                  variant="outline"
                  className={`mt-1 gap-1.5 w-fit capitalize ${ROLE_STYLE[customer.role]}`}
                >
                  <span className="status-dot" />
                  {ROLE_LABEL[customer.role]}
                </Badge>
              </div>
            </div>

            <dl className="grid gap-3 text-sm">
              <div className="flex items-center gap-3 glass-effect rounded-xl px-3 py-2.5">
                <AtSign className="h-4 w-4 shrink-0 text-muted-foreground" />
                <dt className="sr-only">Email</dt>
                <dd className="flex-1 min-w-0 truncate">{customer.email}</dd>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(customer.email);
                    toast.success("Email copied");
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex items-center gap-3 glass-effect rounded-xl px-3 py-2.5">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <dt className="sr-only">Phone</dt>
                <dd className="flex-1 min-w-0 tabular-nums">
                  {customer.phone || (
                    <span className="text-muted-foreground/50">
                      No phone on file
                    </span>
                  )}
                </dd>
              </div>

              <div className="flex items-center gap-3 glass-effect rounded-xl px-3 py-2.5">
                <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                <dt className="sr-only">Joined</dt>
                <dd className="flex-1 min-w-0">
                  {formatDate(customer.createdAt)}
                  <span className="text-muted-foreground">
                    {" "}
                    · {formatRelativeDate(customer.createdAt)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-white/[0.08]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
