import React, { useState } from "react";
import { useStore } from "@/lib/useStore";
import { Store, Check, ChevronsUpDown, Plus, Sparkles, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface StoreSwitcherProps {
  collapsed?: boolean;
}

export function StoreSwitcher({ collapsed = false }: StoreSwitcherProps) {
  const { stores, activeStore, switchStore, createStore, loading } = useStore();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreSlug, setNewStoreSlug] = useState("");
  const [newStoreCurrency, setNewStoreCurrency] = useState("USD");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    setCreating(true);
    try {
      const created = await createStore(
        newStoreName.trim(),
        newStoreSlug.trim() || undefined,
        newStoreCurrency.trim() || "USD"
      );
      if (created) {
        setOpenCreateDialog(false);
        setNewStoreName("");
        setNewStoreSlug("");
      }
    } finally {
      setCreating(false);
    }
  };

  if (loading && !activeStore) {
    return (
      <div className="h-9 w-36 animate-pulse rounded-lg bg-muted/60" />
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-border/80 bg-background/50 hover:bg-muted/60 transition-all font-medium text-xs px-2.5 h-9 rounded-lg max-w-[200px]"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <Store className="h-3.5 w-3.5" />
            </div>
            {!collapsed && (
              <span className="truncate text-left font-semibold text-foreground">
                {activeStore?.name || "Select Store"}
              </span>
            )}
            <ChevronsUpDown className="ml-auto h-3 w-3 text-muted-foreground shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Your Stores ({stores.length})
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {stores.map((s) => (
              <DropdownMenuItem
                key={s.id}
                onClick={() => switchStore(s.id)}
                className="flex items-center justify-between cursor-pointer py-2"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-xs truncate">{s.name}</span>
                  <span className="text-[10px] text-muted-foreground truncate font-mono">
                    {s.slug}
                  </span>
                </div>
                {activeStore?.id === s.id && (
                  <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenCreateDialog(true)}
            className="cursor-pointer text-xs flex items-center gap-2 text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Store</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer text-xs">
            <Link href="/settings" className="flex items-center gap-2 w-full">
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Store Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create New Store Modal */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Create a New Store
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add an isolated merchant store to your account. Each store has its own catalog, orders, and configuration.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="store-name" className="text-xs font-semibold">Store Name *</Label>
              <Input
                id="store-name"
                placeholder="e.g. Acme Apparel"
                value={newStoreName}
                onChange={(e) => {
                  setNewStoreName(e.target.value);
                  if (!newStoreSlug || newStoreSlug === newStoreName.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
                    setNewStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                required
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="store-slug" className="text-xs font-semibold">URL Slug (unique)</Label>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">shopswift.app/</span>
                <Input
                  id="store-slug"
                  placeholder="acme-apparel"
                  value={newStoreSlug}
                  onChange={(e) => setNewStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="store-currency" className="text-xs font-semibold">Base Currency</Label>
              <select
                id="store-currency"
                value={newStoreCurrency}
                onChange={(e) => setNewStoreCurrency(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:ring-1 focus:ring-ring"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpenCreateDialog(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={creating || !newStoreName.trim()}
                className="text-xs font-medium"
              >
                {creating ? "Creating..." : "Create Store"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
