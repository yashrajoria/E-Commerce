import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "sonner";

export function useBulkUpload() {
  const [csvData, setCsvData] = useState([]);
  const [bulkFile, setBulkFile] = useState(null);
  const [isBulk, setIsBulk] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        setIsBulk(true);
        setBulkFile(file);
        toast.success("CSV file loaded successfully!");
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
        toast.error("Error parsing CSV file");
      },
    });
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return toast.error("Upload a CSV first");
    try {
      const formData = new FormData();
      formData.append("file", bulkFile);

      const res = await axios.post("/api/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { isBulk: 1 },
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success("Products uploaded successfully!");
        setCsvData([]);
        setBulkFile(null);
        setIsBulk(false);
      } else toast.error("Upload failed");
    } catch (err) {
      toast.error("Error uploading products");
      console.error(err);
    }
  };

  const downloadSampleCSV = () => {
    const data = [
      {
        Name: "Sample Product 1",
        ImageURL: "https://example.com/image1.jpg",
        price: "29.99",
        Quantity: "100",
        Description: "This is a sample product description",
      },
      {
        Name: "Sample Product 2",
        ImageURL: "https://example.com/image2.jpg",
        price: "49.99",
        Quantity: "50",
        Description: "Another sample product description",
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
  };

  return {
    handleFileUpload,
    handleBulkUpload,
    downloadSampleCSV,
    csvData,
    isBulk,
    bulkFile,
    setCsvData,
  };
}
