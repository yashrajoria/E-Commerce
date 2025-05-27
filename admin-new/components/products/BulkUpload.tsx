import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ArrowDown } from "lucide-react";
import CSVPreviewTable from "./CSVPreviewTable";

type BulkUploadProps = {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBulkUpload: () => void;
  downloadSampleCSV: () => void;
  isBulk: boolean;
  csvData: any[]; // Replace 'any' with your actual CSV row type if available
  bulkFile: File | null;
};

export default function BulkUpload({
  handleFileUpload,
  handleBulkUpload,
  downloadSampleCSV,
  isBulk,
  csvData,
  bulkFile,
}: BulkUploadProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-upload" className="mb-1">
              Upload CSV File
            </Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="bg-white dark:bg-gray-950"
                onChange={handleFileUpload}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              onClick={handleBulkUpload}
              disabled={!isBulk}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Products
            </Button>
            <Button
              onClick={downloadSampleCSV}
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Sample CSV
            </Button>
          </div>
        </div>
      </div>
      {csvData.length > 0 ? (
        <CSVPreviewTable csvData={csvData} />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-12 text-center">
          <div className="flex justify-center mb-4">
            <Upload className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">No CSV File Uploaded</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Upload a CSV file to see a preview of your products here. Make sure
            your CSV has the correct format.
          </p>
          <Button
            onClick={downloadSampleCSV}
            variant="outline"
            className="mx-auto"
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Download Sample CSV
          </Button>
        </div>
      )}
    </div>
  );
}
