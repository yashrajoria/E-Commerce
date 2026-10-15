"use client";

import { useCategories } from "@/hooks/useCategory";
import { Category } from "@/types/shared";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

/** Props accepted by {@link SingleCategory}. */
interface SingleCategoryProps {
  /** Whether the create-category dialog is open. */
  isAddOpen: boolean;
  /** Called with the next open state when the dialog opens or closes. */
  setIsAddOpen: (open: boolean) => void;
  /** Controlled value of the new category name input. */
  newCategoryName: string;
  /** Called with the next name as the user types. */
  setNewCategoryName: (name: string) => void;
  /** Id of the selected parent category, or `null` for a root category. */
  newCategoryParent: string | null;
  /** Called with the selected parent category id, or `null` when cleared. */
  setNewCategoryParent: (parentId: string | null) => void;
  /** Controlled value of the new category image URL input. */
  newCategoryImage: string;
  /** Called with the next image URL as the user types. */
  setNewCategoryImage: (imageUrl: string) => void;
  /** Controlled value of the new category slug input. */
  newCategorySlug: string;
  /** Called with the next slug as the user types. */
  setNewCategorySlug: (slug: string) => void;
  /** Controlled value of the new category path input. */
  newCategoryPath: string;
  /** Called with the next path as the user types. */
  setNewCategoryPath: (path: string) => void;
  /** Controlled value of the new category hierarchy level. */
  newCategoryLevel: number;
  /** Called with the parsed numeric level as the user types. */
  setNewCategoryLevel: (level: number) => void;
  /** Controlled value of the new category active flag. */
  newCategoryActive: boolean;
  /** Called with the next active flag when the checkbox toggles. */
  setNewCategoryActive: (active: boolean) => void;
  /** Submits the form and creates the category via the parent page. */
  handleAddCategory: () => void;
}

/**
 * Renders the "Add Category" dialog with name, parent, image, slug, path, level and active fields.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <SingleCategory
 *   isAddOpen={isAddOpen}
 *   setIsAddOpen={setIsAddOpen}
 *   newCategoryName={newCategoryName}
 *   setNewCategoryName={setNewCategoryName}
 *   handleAddCategory={handleAddCategory}
 *   newCategoryParent={newCategoryParent}
 *   setNewCategoryParent={setNewCategoryParent}
 *   newCategoryImage={newCategoryImage}
 *   setNewCategoryImage={setNewCategoryImage}
 *   newCategorySlug={newCategorySlug}
 *   setNewCategorySlug={setNewCategorySlug}
 *   newCategoryPath={newCategoryPath}
 *   setNewCategoryPath={setNewCategoryPath}
 *   newCategoryLevel={newCategoryLevel}
 *   setNewCategoryLevel={setNewCategoryLevel}
 *   newCategoryActive={newCategoryActive}
 *   setNewCategoryActive={setNewCategoryActive}
 * />
 * ```
 */
const SingleCategory = ({
  isAddOpen,
  setIsAddOpen,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
  newCategoryParent,
  setNewCategoryParent,
  newCategoryImage,
  setNewCategoryImage,
  newCategorySlug,
  setNewCategorySlug,
  newCategoryPath,
  setNewCategoryPath,
  newCategoryLevel,
  setNewCategoryLevel,
  newCategoryActive,
  setNewCategoryActive,
}: SingleCategoryProps) => {
  const { categories } = useCategories();
  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-2 text-xs gradient-purple text-white hover:opacity-90 rounded-xl h-8 border-0"
        >
          <Plus size={13} />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-effect-strong border-white/8">
        <DialogHeader>
          <DialogTitle className="text-gradient">New Category</DialogTitle>
          <DialogDescription>Create a new product category</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2 grid grid-cols-1 gap-3">
            <div>
              <Label className="text-sm">Category Name</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="bg-white/[0.04] border-white/[0.08] rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm">Parent Category (optional)</Label>
              <select
                value={newCategoryParent || ""}
                onChange={(e) => setNewCategoryParent(e.target.value || null)}
                className="w-full bg-white/4 border-white/8 rounded-xl h-9 px-3"
              >
                <option value="">None</option>
                {Array.isArray(categories) &&
                  categories.map((c: Category) => (
                    <option key={c.id ?? c._id} value={c.id ?? c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <Label className="text-sm">Image URL (optional)</Label>
              <Input
                value={newCategoryImage}
                onChange={(e) => setNewCategoryImage(e.target.value)}
                placeholder="https://.../image.jpg"
                className="bg-white/[0.04] border-white/[0.08] rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm">Slug (optional)</Label>
              <Input
                value={newCategorySlug}
                onChange={(e) => setNewCategorySlug(e.target.value)}
                placeholder="peripherals"
                className="bg-white/[0.04] border-white/[0.08] rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm">Path (optional)</Label>
              <Input
                value={newCategoryPath}
                onChange={(e) => setNewCategoryPath(e.target.value)}
                placeholder="string"
                className="bg-white/[0.04] border-white/[0.08] rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Level</Label>
                <Input
                  type="number"
                  value={newCategoryLevel}
                  onChange={(e) => setNewCategoryLevel(Number(e.target.value))}
                  className="bg-white/[0.04] border-white/[0.08] rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm">Active</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newCategoryActive}
                    onChange={(e) => setNewCategoryActive(e.target.checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    is_active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsAddOpen(false)}
            className="rounded-xl border-white/[0.08]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddCategory}
            className="gradient-purple text-white border-0 rounded-xl"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SingleCategory;
