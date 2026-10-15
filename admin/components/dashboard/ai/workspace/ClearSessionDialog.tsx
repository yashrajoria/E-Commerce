import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

/** Props accepted by {@link ClearSessionDialog}. */
interface ClearSessionDialogProps {
  /** Whether the confirmation dialog is visible. */
  open: boolean;
  /** Called when the dialog requests to open or close. */
  onOpenChange: (open: boolean) => void;
  /** Called when the user confirms clearing the AI session. */
  onConfirmClear: () => void;
}

/**
 * Renders the confirmation dialog for clearing the active AI session context.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <ClearSessionDialog
 *   open={clearDialogOpen}
 *   onOpenChange={setClearDialogOpen}
 *   onConfirmClear={clearSession}
 * />
 * ```
 */
export function ClearSessionDialog({
  open,
  onOpenChange,
  onConfirmClear,
}: ClearSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect-strong border-white/15 text-foreground">
        <DialogHeader>
          <DialogTitle>Clear AI session?</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This resets active conversation context and local history pointers
            for this admin account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-white/20 bg-white/[0.04] text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirmClear}
            className="rounded-xl gradient-amber text-[hsl(38,92%,12%)] hover:opacity-90"
          >
            Confirm clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
