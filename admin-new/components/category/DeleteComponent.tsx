/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";

export default function DeleteComponent({
  isDeleteOpen,
  setIsDeleteOpen,
  selectedCategory,
  handleDeleteCategory,
}: {
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedCategory: any;
  handleDeleteCategory: () => void;
}) {
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
