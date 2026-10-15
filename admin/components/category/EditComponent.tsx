import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

/** Props accepted by {@link EditComponent}. */
interface EditComponentProps {
  /** Whether the edit dialog is open. */
  isEditOpen: boolean;
  /** Called with the next open state when the dialog opens or closes. */
  setIsEditOpen: (open: boolean) => void;
  /** Controlled value of the category name input. */
  editCategoryName: string;
  /** Called with the next name as the user types. */
  setEditCategoryName: (name: string) => void;
  /** Persists the edited name via the parent page. */
  handleEditCategory: () => void;
}

/**
 * Renders the dialog for renaming an existing category.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <EditComponent
 *   isEditOpen={isEditOpen}
 *   setIsEditOpen={setIsEditOpen}
 *   editCategoryName={editCategoryName}
 *   setEditCategoryName={setEditCategoryName}
 *   handleEditCategory={handleEditCategory}
 * />
 * ```
 */
const EditComponent = ({
  isEditOpen,
  setIsEditOpen,
  editCategoryName,
  setEditCategoryName,
  handleEditCategory,
}: EditComponentProps) => {
  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className="glass-effect-strong border-white/8">
        <DialogHeader>
          <DialogTitle className="text-gradient">Edit Category</DialogTitle>
          <DialogDescription>Update category name</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm">Category Name</Label>
            <Input
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="bg-white/4 border-white/8 rounded-xl"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsEditOpen(false)}
            className="rounded-xl border-white/[0.08]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditCategory}
            className="gradient-purple text-white border-0 rounded-xl"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditComponent;
