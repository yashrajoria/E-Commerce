/**
 * Premium Categories Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import EmptyState from "@/components/ui/empty-state";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCategories } from "@/hooks/useCategory";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit,
  FolderTree,
  Grid3X3,
  Layers,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import axios from "axios";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // build payload to match backend schema
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
                <DialogTitle className="text-gradient">
                  New Category
                </DialogTitle>
                <DialogDescription>
                  Create a new product category
                </DialogDescription>
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
                    <Label className="text-sm">
                      Parent Category (optional)
                    </Label>
                    <select
                      value={newCategoryParent || ""}
                      onChange={(e) =>
                        setNewCategoryParent(e.target.value || null)
                      }
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
                        onChange={(e) =>
                          setNewCategoryLevel(Number(e.target.value))
                        }
                        className="bg-white/[0.04] border-white/[0.08] rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Active</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newCategoryActive}
                          onChange={(e) =>
                            setNewCategoryActive(e.target.checked)
                          }
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

          {/* Bulk Upload Dialog */}
          <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 text-xs text-muted-foreground hover:opacity-90 rounded-xl h-8 border-white/[0.04] ml-2"
              >
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-effect-strong border-white/[0.08]">
              <DialogHeader>
                <DialogTitle className="text-gradient">
                  Bulk Upload Categories
                </DialogTitle>
                <DialogDescription>
                  Upload a CSV file or paste CSV content. Required header: name.
                  Optional: parent_ids (semicolon-separated), image, slug, path,
                  level, is_active.
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <input
                  type="file"
                  accept="text/csv,application/vnd.ms-excel"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const text = String(reader.result || "");
                      (
                        document.getElementById(
                          "_bulk_csv_input",
                        ) as HTMLTextAreaElement
                      ).value = text;
                    };
                    reader.readAsText(f);
                  }}
                />

                <div className="mt-3">
                  <Label className="text-sm">CSV Content</Label>
                  <textarea
                    id="_bulk_csv_input"
                    className="w-full h-40 p-2 bg-white/[0.03] border-white/[0.08] rounded-md"
                    placeholder={`name,parent_ids,image,slug,path,level,is_active\nElectronics,,https://...,electronics,/,1,true`}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBulkOpen(false)}
                  className="rounded-xl border-white/[0.08]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const textarea = document.getElementById(
                        "_bulk_csv_input",
                      ) as HTMLTextAreaElement;
                      const csv = (textarea?.value || "").trim();
                      if (!csv) {
                        toast.error("No CSV content provided");
                        return;
                      }

                      // simple CSV parser
                      const lines = csv.split(/\r?\n/).filter(Boolean);
                      const headers = lines[0].split(",").map((h) => h.trim());
                      const rows = lines.slice(1).map((ln) => {
                        const cols = ln.split(",");
                        const obj: Record<string, string> = {};
                        headers.forEach(
                          (h, i) => (obj[h] = (cols[i] || "").trim()),
                        );
                        return obj;
                      });

                      const payload = rows.map((r) => ({
                        name: r["name"] || "",
                        parent_ids: r["parent_ids"]
                          ? r["parent_ids"]
                              .split(";")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          : [],
                        image: r["image"] || undefined,
                        slug: r["slug"] || undefined,
                        path: r["path"] ? [r["path"]] : [],
                        level: r["level"] ? Number(r["level"]) : 1,
                        is_active: r["is_active"]
                          ? String(r["is_active"]).toLowerCase() === "true"
                          : true,
                      }));

                      await axios.post(
                        "/api/categories/bulk",
                        { items: payload },
                        { withCredentials: true },
                      );
                      toast.success("Bulk categories uploaded");
                      setIsBulkOpen(false);
                      window.location.reload();
                    } catch (err) {
                      console.error(err);
                      toast.error("Bulk upload failed");
                    }
                  }}
                  className="gradient-purple text-white border-0 rounded-xl"
                >
                  Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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

      {/* Delete Confirmation */}
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
    </PageLayout>
  );
};

export default Categories;
