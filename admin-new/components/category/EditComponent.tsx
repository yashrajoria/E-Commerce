import React from "react";
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

const EditComponent = ({
  isEditOpen,
  setIsEditOpen,
  editCategoryName,
  setEditCategoryName,
  handleEditCategory,
}: {
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  editCategoryName: string;

  setEditCategoryName: (name: string) => void;
  handleEditCategory: () => void;
}) => {
  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className="glass-effect-strong border-white/[0.08]">
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
              className="bg-white/[0.04] border-white/[0.08] rounded-xl"
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
