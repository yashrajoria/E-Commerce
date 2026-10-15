import { AnimatePresence, motion } from "framer-motion";
import { FolderTree, Edit, Trash2 } from "lucide-react";
import { pageItem } from "../layout/PageLayout";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { EmptyState } from "../admin/shared/DataStates";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";

import { Category } from "@/types/shared";

/** Props accepted by {@link CategoryTable}. */
interface CategoryTableProps {
  /** Whether the category list is still loading. */
  loading: boolean;
  /** Categories for the current page slice. */
  paginatedCategories: Category[];
  /** Current search term, used to tailor the empty-state copy. */
  searchQuery: string;
  /** Opens the create-category dialog. */
  setIsAddOpen: (open: boolean) => void;
  /** Opens the edit-category dialog. */
  setIsEditOpen: (open: boolean) => void;
  /** Stores the category the user is acting on. */
  setSelectedCategory: (category: Category) => void;
  /** Opens the delete-category dialog. */
  setIsDeleteOpen: (open: boolean) => void;
  /** Reserved for inline editing; currently unused by this table. */
  handleEditCategory?: () => void;
  /** Reserved for inline deletion; currently unused by this table. */
  handleDeleteCategory?: () => void;
  /** Seeds the edit dialog's name field before it opens. */
  setEditCategoryName: (name: string) => void;
}

/**
 * Renders the animated category table with loading, empty and populated states.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <CategoryTable
 *   loading={loading}
 *   paginatedCategories={paginatedCategories}
 *   searchQuery={searchQuery}
 *   setIsAddOpen={setIsAddOpen}
 *   setIsEditOpen={setIsEditOpen}
 *   setSelectedCategory={setSelectedCategory}
 *   setIsDeleteOpen={setIsDeleteOpen}
 *   setEditCategoryName={setEditCategoryName}
 * />
 * ```
 */
const CategoryTable = ({
  loading,
  paginatedCategories,
  searchQuery,
  setIsAddOpen,
  setIsEditOpen,
  setSelectedCategory,
  setIsDeleteOpen,
  handleEditCategory,
  handleDeleteCategory,
  setEditCategoryName,
}: CategoryTableProps) => {
  // avoid unused variable ESLint errors when callbacks are optional
  void handleEditCategory;
  void handleDeleteCategory;
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.section
          key="loading"
          variants={pageItem}
          className="flex items-center justify-center py-16"
        >
          <LoadingSpinner />
        </motion.section>
      ) : paginatedCategories.length === 0 ? (
        <motion.section key="empty" variants={pageItem}>
          <div className="glass-effect rounded-xl">
            <EmptyState
              icon={FolderTree}
              title="No categories found"
              description={
                searchQuery
                  ? "Try a different search term"
                  : "Create your first category to organize products"
              }
              actionLabel="Add Category"
              onAction={() => setIsAddOpen(true)}
            />
          </div>
        </motion.section>
      ) : (
        <motion.section key="table" variants={pageItem}>
          <Card className="glass-effect overflow-hidden border-white/6">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/4">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Name
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      ID
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCategories.map((cat: Category, index: number) => (
                    <motion.tr
                      key={cat.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="border-white/4 hover:bg-white/2 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg gradient-purple flex items-center justify-center">
                            <FolderTree className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium text-sm">
                            {cat.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono text-muted-foreground">
                          {cat.id}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-white/6 rounded-lg"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setEditCategoryName(cat.name ?? "");
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-red-500/10 text-red-400 rounded-lg"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default CategoryTable;
