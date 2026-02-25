import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import axios from "axios";
import { Label } from "recharts";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";

export default function BulkUpload({
  isBulkOpen,
  setIsBulkOpen,
}: {
  isBulkOpen: boolean;
  setIsBulkOpen: (open: boolean) => void;
}) {
  return (
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
                  headers.forEach((h, i) => (obj[h] = (cols[i] || "").trim()));
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
  );
}
