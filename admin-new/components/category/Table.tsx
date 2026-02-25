/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import { FolderTree, Edit, Trash2 } from "lucide-react";
import React from "react";
import { pageItem } from "../layout/PageLayout";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import EmptyState from "../ui/empty-state";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";

const CategoryTable = ({
  loading,
  paginatedCategories,
  searchQuery,
  setIsAddOpen,
  setIsEditOpen,
  setSelectedCategory,
  setIsDeleteOpen,
  //   handleEditCategory,
  //   handleDeleteCategory,
  setEditCategoryName,
}: {
  loading: boolean;
  paginatedCategories: any[];
  searchQuery: string;
  setIsAddOpen: (open: boolean) => void;
  setIsEditOpen: (open: boolean) => void;
  setSelectedCategory: (category: any) => void;
  setIsDeleteOpen: (open: boolean) => void;
  handleEditCategory: () => void;
  handleDeleteCategory: () => void;
  setEditCategoryName: (name: string) => void;
}) => {
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
          <Card className="glass-effect overflow-hidden border-white/[0.06]">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.04]">
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
                  {paginatedCategories.map((cat: any, index: number) => (
                    <motion.tr
                      key={cat.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
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
                            className="h-8 w-8 hover:bg-white/[0.06] rounded-lg"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setEditCategoryName(cat.name);
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
