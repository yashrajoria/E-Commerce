/* eslint-disable @typescript-eslint/no-explicit-any */

import BulkUpload from "@/components/category/BulkUpload";
import DeleteComponent from "@/components/category/DeleteComponent";
import EditComponent from "@/components/category/EditComponent";
import SingleCategory from "@/components/category/SingleCategory";
import CategoryTable from "@/components/category/Table";
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import StatsCard from "@/components/ui/stats-card";
import { useCategories } from "@/hooks/useCategory";
import axios from "axios";
import { motion } from "framer-motion";
import { FolderTree, Grid3X3, Layers, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const Categories = () => {
  const { categories, loading } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryParent, setNewCategoryParent] = useState<string | null>(
    null,
  );
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryPath, setNewCategoryPath] = useState<string>("");
  const [newCategoryLevel, setNewCategoryLevel] = useState<number>(1);
  const [newCategoryActive, setNewCategoryActive] = useState<boolean>(true);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    let result = [...categories] as any[];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.name?.toLowerCase().includes(q));
    }
    return result;
  }, [categories, searchQuery]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const payload: any = {
        name: newCategoryName,
        parent_ids: newCategoryParent ? [newCategoryParent] : [],
        image: newCategoryImage || undefined,
        ancestors: newCategoryParent ? [newCategoryParent] : [],
        slug:
          newCategorySlug ||
          (newCategoryName || "").toLowerCase().replace(/\s+/g, "-"),
        path: newCategoryPath ? [newCategoryPath] : [],
        level: newCategoryLevel,
        is_active: newCategoryActive,
      };

      await axios.post("/api/categories", payload, { withCredentials: true });
      toast.success("Category created successfully!");
      setNewCategoryName("");
      setNewCategoryParent(null);
      setNewCategoryImage("");
      setNewCategorySlug("");
      setNewCategoryPath("");
      setNewCategoryLevel(1);
      setNewCategoryActive(true);
      setIsAddOpen(false);
      window.location.reload();
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || !selectedCategory) return;
    try {
      await axios.put(
        `/api/categories/${selectedCategory.id}`,
        { name: editCategoryName },
        { withCredentials: true },
      );
      toast.success("Category updated successfully!");
      setIsEditOpen(false);
      window.location.reload();
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await axios.delete(`/api/categories/${selectedCategory.id}`, {
        withCredentials: true,
      });
      toast.success("Category deleted successfully!");
      setIsDeleteOpen(false);
      window.location.reload();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <PageLayout
      title="Categories"
      breadcrumbs={[{ label: "Categories" }]}
      headerActions={
        <>
          <SingleCategory
            isAddOpen={isAddOpen}
            setIsAddOpen={setIsAddOpen}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            handleAddCategory={handleAddCategory}
            newCategoryParent={newCategoryParent}
            setNewCategoryParent={setNewCategoryParent}
            newCategoryImage={newCategoryImage}
            setNewCategoryImage={setNewCategoryImage}
            newCategorySlug={newCategorySlug}
            setNewCategorySlug={setNewCategorySlug}
            newCategoryPath={newCategoryPath}
            setNewCategoryPath={setNewCategoryPath}
            newCategoryLevel={newCategoryLevel}
            setNewCategoryLevel={setNewCategoryLevel}
            newCategoryActive={newCategoryActive}
            setNewCategoryActive={setNewCategoryActive}
          />

          {/* Bulk Upload Dialog */}
          <BulkUpload isBulkOpen={isBulkOpen} setIsBulkOpen={setIsBulkOpen} />
        </>
      }
    >
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Categories"
          value={categories?.length || 0}
          icon={FolderTree}
          trend={{ value: 2.3, label: "vs last month" }}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Active"
          value={categories?.length || 0}
          icon={Layers}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Products Linked"
          value="—"
          icon={Grid3X3}
          gradient="gradient-blue"
        />
        <StatsCard
          title="Empty Categories"
          value={0}
          icon={FolderTree}
          gradient="gradient-amber"
        />
      </motion.section>

      {/* Search */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-xl p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search categories..."
              className="pl-10 bg-white/[0.04] border-white/[0.08] rounded-xl h-9"
            />
          </div>
        </div>
      </motion.section>

      {/* Table */}
      <CategoryTable
        loading={loading}
        paginatedCategories={paginatedCategories}
        searchQuery={searchQuery}
        setIsAddOpen={setIsAddOpen}
        setIsEditOpen={setIsEditOpen}
        setSelectedCategory={setSelectedCategory}
        setIsDeleteOpen={setIsDeleteOpen}
        handleEditCategory={handleEditCategory}
        handleDeleteCategory={handleDeleteCategory}
        setEditCategoryName={setEditCategoryName}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.section variants={pageItem} className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`rounded-xl ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`rounded-xl ${currentPage === i + 1 ? "gradient-purple text-white border-0" : ""}`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={`rounded-xl ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.section>
      )}

      {/* Edit Dialog */}
      <EditComponent
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        editCategoryName={editCategoryName}
        setEditCategoryName={setEditCategoryName}
        handleEditCategory={handleEditCategory}
      />

      {/* Delete Dialog */}
      <DeleteComponent
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        selectedCategory={selectedCategory}
        handleDeleteCategory={handleDeleteCategory}
      />
    </PageLayout>
  );
};

export default Categories;
