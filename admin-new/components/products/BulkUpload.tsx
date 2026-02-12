/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  FileSpreadsheet,
  Upload,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

type BulkUploadProps = {
  csvData: any[];
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validateBulkUpload: () => void;
  confirmBulkUpload: () => void;
  isBulk: boolean;
  isValidating: boolean;
  isUploading: boolean;
  validationResult: any;
};

const BulkUpload = ({
  csvData,
  handleFileUpload,
  validateBulkUpload,
  confirmBulkUpload,
  isBulk,
  isValidating,
  isUploading,
  validationResult,
}: BulkUploadProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Step 1: Template & Upload ── */}
      <motion.div variants={itemVariants}>
        <div className="glass-effect rounded-2xl overflow-hidden">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl gradient-purple flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Upload className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Bulk Product Upload
                </h3>
                <p className="text-xs text-muted-foreground">
                  Upload multiple products at once using our CSV template
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Template Download Card */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileSpreadsheet className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      CSV Template
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Download and fill in your data
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full gap-2 h-10 border-white/[0.08] hover:bg-white/[0.04] rounded-xl text-sm"
                  onClick={() => {
                    // Download sample CSV
                    const csv =
                      "name,description,price,quantity,categories,imageurl,is_featured\nSample Product,A great product,29.99,100,Electronics,https://example.com/img.jpg,true";
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "product-template.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download size={14} />
                  Download Template
                </Button>
              </div>

              {/* File Upload Card */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Upload className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      Upload CSV
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Select your formatted CSV file
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className={`
                      border border-dashed rounded-xl p-5 text-center transition-all duration-300
                      ${
                        isBulk && csvData.length > 0
                          ? "border-emerald-500/30 bg-emerald-500/[0.03]"
                          : "border-white/[0.08] hover:border-purple-500/30 hover:bg-purple-500/[0.02]"
                      }
                    `}
                  >
                    {isBulk && csvData.length > 0 ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-emerald-400">
                            {csvData.length} products loaded
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Click to replace file
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/[0.06] flex items-center justify-center">
                          <Upload className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">
                            Click to upload CSV
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Drag and drop or browse
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Step 2: Data Preview ── */}
      <AnimatePresence>
        {csvData.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12 }}
            layout
          >
            <div className="glass-effect rounded-2xl overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl gradient-blue flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <FileSpreadsheet className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Data Preview
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Review your products before uploading
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white/[0.06] text-muted-foreground border-white/[0.08] text-xs font-mono"
                  >
                    {csvData.length} products
                  </Badge>
                </div>
              </div>

              {/* Table */}
              <div className="p-6">
                <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                  <div className="max-h-80 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/[0.06] hover:bg-transparent">
                          <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Name
                          </TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Description
                          </TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Price
                          </TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Qty
                          </TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.slice(0, 10).map((product, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                          >
                            <TableCell className="text-sm font-medium">
                              {product.name || product.Name || "N/A"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                              {product.description ||
                                product.Description ||
                                "N/A"}
                            </TableCell>
                            <TableCell className="text-sm font-mono text-emerald-400">
                              ${product.price || product.Price || "0.00"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {product.quantity || product.Quantity || "0"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
                              >
                                {product.status || "active"}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {csvData.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Showing first 10 of {csvData.length} products
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Validation Result ── */}
      <AnimatePresence>
        {validationResult && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12 }}
            layout
          >
            <div
              className={`glass-effect rounded-2xl overflow-hidden border ${
                validationResult.success
                  ? "border-emerald-500/20"
                  : "border-amber-500/20"
              }`}
            >
              <div className="px-6 py-4 flex items-center gap-3">
                {validationResult.success ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {validationResult.success
                      ? "Validation passed! Ready to upload."
                      : "Some issues found. Please review."}
                  </p>
                  {validationResult.message && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {validationResult.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step 3: Actions ── */}
      <AnimatePresence>
        {csvData.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.98 }}
            layout
          >
            <div className="glass-effect rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-400" />
                  {csvData.length} products ready to process
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-9 gap-2"
                    onClick={() => {
                      // Clear is handled by re-uploading
                    }}
                    disabled={isValidating || isUploading}
                  >
                    <X size={13} />
                    Clear
                  </Button>

                  {!validationResult?.success && (
                    <Button
                      size="sm"
                      onClick={validateBulkUpload}
                      disabled={isValidating || isUploading}
                      className="gradient-blue text-white border-0 rounded-xl h-9 px-5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all gap-2"
                    >
                      {isValidating ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Validating...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={13} />
                          Validate
                        </>
                      )}
                    </Button>
                  )}

                  {validationResult?.success && (
                    <Button
                      size="sm"
                      onClick={confirmBulkUpload}
                      disabled={isUploading}
                      className="gradient-purple text-white border-0 rounded-xl h-9 px-5 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={13} />
                          Upload {csvData.length} Products
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {(isValidating || isUploading) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-2"
                >
                  <Progress value={isUploading ? 66 : 33} className="h-1.5" />
                  <p className="text-xs text-center text-muted-foreground">
                    {isValidating
                      ? "Validating product data..."
                      : "Uploading products, please wait..."}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BulkUpload;
