"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCategories } from "@/hooks/useCategory";
import React from "react";
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
}: {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  newCategoryParent: string | null;
  setNewCategoryParent: (parentId: string | null) => void;
  newCategoryImage: string;
  setNewCategoryImage: (imageUrl: string) => void;
  newCategorySlug: string;
  setNewCategorySlug: (slug: string) => void;
  newCategoryPath: string;
  setNewCategoryPath: (path: string) => void;
  newCategoryLevel: number;
  setNewCategoryLevel: (level: number) => void;
  newCategoryActive: boolean;
  setNewCategoryActive: (active: boolean) => void;
  handleAddCategory: () => void;
}) => {
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
      <DialogContent className="glass-effect-strong border-white/[0.08]">
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
                className="w-full bg-white/[0.04] border-white/[0.08] rounded-xl h-9 px-3"
              >
                <option value="">None</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
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
