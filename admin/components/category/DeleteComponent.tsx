import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";

import { Category } from "@/types/shared";

/** Props accepted by {@link DeleteComponent}. */
interface DeleteComponentProps {
  /** Whether the delete confirmation dialog is open. */
  isDeleteOpen: boolean;
  /** Called with the next open state when the dialog opens or closes. */
  setIsDeleteOpen: (open: boolean) => void;
  /** Category targeted for deletion, shown in the confirmation copy. */
  selectedCategory: Category | null;
  /** Performs the deletion of {@link DeleteComponentProps.selectedCategory}. */
  handleDeleteCategory: () => void;
}

/**
 * Renders the confirmation dialog for deleting a single category.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <DeleteComponent
 *   isDeleteOpen={isDeleteOpen}
 *   setIsDeleteOpen={setIsDeleteOpen}
 *   selectedCategory={selectedCategory}
 *   handleDeleteCategory={handleDeleteCategory}
 * />
 * ```
 */
export default function DeleteComponent({
  isDeleteOpen,
  setIsDeleteOpen,
  selectedCategory,
  handleDeleteCategory,
}: DeleteComponentProps) {
  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent className="glass-effect-strong border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-red-400">Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{selectedCategory?.name}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}
            className="rounded-xl border-white/[0.08]"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteCategory}
            className="rounded-xl"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
