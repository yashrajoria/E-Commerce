import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

const productSchema = z.object({
  name: z.string(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  quantity: z.string().regex(/^\d+$/, "Quantity must be a number"),
  is_featured: z.string().optional(),
  categories: z.string(),
  description: z.string().optional(),
  imageurl: z.string().url("Invalid URL format"),
});

export function useBulkUpload() {
  const [csvData, setCsvData] = useState([]);
  const [bulkFile, setBulkFile] = useState(null);
  const [isBulk, setIsBulk] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous state
    setValidationResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        setIsBulk(true);
        setBulkFile(file);
        toast.success(
          `CSV file loaded successfully! ${results.data.length} rows found.`,
        );
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
        toast.error("Error parsing CSV file");
      },
    });
  };

  const validateBulkUpload = async () => {
    if (!bulkFile) {
      toast.error("Please upload a CSV file first");
      return null;
    }

    setIsValidating(true);

    try {
      const formData = new FormData();
      formData.append("file", bulkFile);

      const res = await axios.post(
        "http://localhost:8080/products/bulk/validate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      const validation = res.data;
      setValidationResult(validation);

      // Show validation summary
      if (validation.errors && validation.errors.length > 0) {
        toast.error(
          `Found ${validation.errors.length} errors. Please fix them before importing.`,
          { duration: 5000 },
        );
        return validation;
      }

      if (validation.warnings && validation.warnings.length > 0) {
        toast.warning(
          `Found ${validation.warnings.length} warnings. Products will be created but some issues were detected.`,
          { duration: 5000 },
        );
      }

      if (
        validation.missing_categories &&
        validation.missing_categories.length > 0
      ) {
        toast.info(
          `${
            validation.missing_categories.length
          } new categories will be created: ${validation.missing_categories.join(
            ", ",
          )}`,
          { duration: 5000 },
        );
      }

      if (validation.duplicate_skus && validation.duplicate_skus.length > 0) {
        toast.warning(
          `${validation.duplicate_skus.length} products with duplicate SKUs will be skipped.`,
          { duration: 5000 },
        );
      }

      toast.success(
        `Validation complete! ${validation.valid_products} products ready to import.`,
      );

      return validation;
    } catch (err) {
      console.error("Validation Error:", err);
      toast.error(err.response?.data?.error || "Error validating CSV file");
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const validateCSVData = (data) => {
    return data
      .map((row, index) => {
        try {
          return productSchema.parse(row);
        } catch (error) {
          console.error(`Validation error in row ${index + 1}:`, error);
          return null;
        }
      })
      .filter(Boolean);
  };

  const handleBulkUpload = async (autoCreateCategories = true) => {
    if (!bulkFile) {
      toast.error("Please upload a CSV file first");
      return;
    }

    // If validation hasn't been run, run it first
    let validation = validationResult;
    if (!validation) {
      validation = await validateBulkUpload();
      if (!validation) return; // Validation failed
    }

    // Don't proceed if there are errors
    if (validation.errors && validation.errors.length > 0) {
      toast.error("Please fix all errors before importing");
      return;
    }

    // Confirm if categories need to be created
    if (
      validation.missing_categories &&
      validation.missing_categories.length > 0
    ) {
      const confirmed = window.confirm(
        `The following categories don't exist:\n${validation.missing_categories.join(
          ", ",
        )}\n\nDo you want to create them?`,
      );

      if (!confirmed) {
        toast.info(
          "Import cancelled. Please update your CSV or create categories manually.",
        );
        return;
      }
      autoCreateCategories = true;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", bulkFile);

      const res = await axios.post(
        `http://localhost:8080/products/bulk?auto_create_categories=${autoCreateCategories}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      const result = res.data;

      if (result.inserted_count > 0) {
        toast.success(
          `Successfully imported ${result.inserted_count} products!`,
          { duration: 5000 },
        );
      }

      if (result.errors && result.errors.length > 0) {
        toast.warning(
          `${result.errors.length} products failed to import. Check console for details.`,
          { duration: 5000 },
        );
        console.error("Import errors:", result.errors);
      }

      // Reset state after successful upload
      setCsvData([]);
      setBulkFile(null);
      setIsBulk(false);
      setValidationResult(null);
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err.response?.data?.error || "Error uploading products");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    const data = [
      {
        name: "MacBook Pro 16-inch M3 Max",
        price: "2499.99",
        quantity: "25",
        is_featured: "TRUE",
        categories: "Electronics,Computers & Laptops",
        description:
          "Powerful 16-inch MacBook Pro with M3 Max chip perfect for creative professionals and developers.",
        imageurl:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
        brand: "Apple",
        sku: "MBPRO-16-M3-2024",
      },
      {
        name: "Samsung Galaxy S25 Ultra",
        price: "1199.99",
        quantity: "60",
        is_featured: "TRUE",
        categories: "Electronics,Smartphones",
        description:
          "Premium flagship smartphone with 200MP camera and 6.8-inch dynamic AMOLED display.",
        imageurl:
          "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=600&h=400&fit=crop",
        brand: "Samsung",
        sku: "SGX-S25U-BLK-256GB",
      },
      {
        name: "Nike Air Force 1",
        price: "89.99",
        quantity: "150",
        is_featured: "FALSE",
        categories: "Clothing,Shoes",
        description:
          "Iconic white leather sneaker perfect for any casual outfit.",
        imageurl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
        brand: "Nike",
        sku: "NK-AF1-WHT-11",
      },
    ];

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Sample CSV downloaded!");
  };

  const resetUpload = () => {
    setCsvData([]);
    setBulkFile(null);
    setIsBulk(false);
    setValidationResult(null);
  };

  const handleUpload = async (file) => {
    try {
      const response = await axios.post("/api/upload", file);
      toast.success("File uploaded successfully!");
      return response.data;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during upload.",
      );
    }
  };

  return {
    // Functions
    handleFileUpload,
    validateBulkUpload,
    handleBulkUpload,
    downloadSampleCSV,
    resetUpload,
    handleUpload,

    // State
    csvData,
    isBulk,
    bulkFile,
    isValidating,
    isUploading,
    validationResult,

    // Setters (if needed)
    setCsvData,
  };
}
