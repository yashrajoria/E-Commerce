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

interface ClearSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmClear: () => void;
}

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

