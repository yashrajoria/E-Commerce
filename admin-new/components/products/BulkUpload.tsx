import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";

type BulkUploadProps = {
  csvData: [];
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  downloadSampleCSV: () => void;
  csvFile: File | null;
  handleBulkUpload: () => void;
  isSubmitting: boolean;
  setCsvData: (data: []) => void;
  setCsvFile: (file: File | null) => void;
};

const BulkUpload = ({
  csvData,
  handleFileUpload,
  downloadSampleCSV,
  csvFile,
  handleBulkUpload,
  isSubmitting,
  setCsvData,
  setCsvFile,
}: BulkUploadProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const clearData = () => {
    setCsvData([]);
    setCsvFile(null);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Bulk Product Upload
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload multiple products at once using our CSV template. Quick,
          efficient, and error-free.
        </p>
      </motion.div>

      {/* Combined Template & Upload Section */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-950/30 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
          <CardContent className="relative p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Template Download */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">CSV Template</h3>
                    <p className="text-sm text-muted-foreground">
                      Download our template to format your data
                    </p>
                  </div>
                </div>
                <Button
                  onClick={downloadSampleCSV}
                  variant="outline"
                  className="w-full gap-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-950/50 transition-all duration-200"
                >
                  <Download size={16} />
                  Download Template
                </Button>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Upload className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Upload CSV</h3>
                    <p className="text-sm text-muted-foreground">
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
                    border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
                    ${
                      csvFile
                        ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30"
                        : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50 dark:border-gray-700 dark:hover:border-purple-600 dark:hover:bg-purple-950/30"
                    }
                  `}
                  >
                    {csvFile ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-2"
                      >
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                          {csvFile.name}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          File uploaded successfully
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                        <p className="text-sm font-medium">
                          Click to upload CSV
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Drag and drop or browse files
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Preview */}
      <AnimatePresence>
        {csvData.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            layout
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        <FileSpreadsheet className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      Data Preview
                    </CardTitle>
                    <CardDescription>
                      Review your products before uploading
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {csvData.length} products
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearData}
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-white/50 bg-white/50 dark:border-gray-800 dark:bg-gray-900/50 overflow-hidden">
                  <div className="max-h-80 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">
                            Description
                          </TableHead>
                          <TableHead className="font-semibold">Price</TableHead>
                          <TableHead className="font-semibold">
                            Quantity
                          </TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.slice(0, 10).map((product, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                          >
                            <TableCell className="font-medium">
                              {product.name || product.Name || "N/A"}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {product.description ||
                                product.Description ||
                                "N/A"}
                            </TableCell>
                            <TableCell className="font-mono">
                              ${product.price || product.Price || "0.00"}
                            </TableCell>
                            <TableCell>
                              {product.quantity || product.Quantity || "0"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
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
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    Showing first 10 of {csvData.length} products
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Section */}
      <AnimatePresence>
        {csvData.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95 }}
            layout
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Button
                    onClick={handleBulkUpload}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px] h-12"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <FileSpreadsheet size={16} />
                        </motion.div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload size={16} />
                        <span>Upload {csvData.length} Products</span>
                      </div>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={clearData}
                    disabled={isSubmitting}
                    className="border-gray-300 hover:border-red-300 hover:bg-red-50 dark:border-gray-700 dark:hover:border-red-700 dark:hover:bg-red-950/30 min-w-[120px] h-12"
                  >
                    <X size={16} className="mr-2" />
                    Clear All
                  </Button>
                </div>

                {isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 space-y-2"
                  >
                    <Progress value={33} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      Uploading products, please wait...
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BulkUpload;
