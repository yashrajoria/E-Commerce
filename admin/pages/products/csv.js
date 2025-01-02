import Layout from "@/components/Layout";
import ProductTable from "@/components/ProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useSession } from "next-auth/react";
import Papa from "papaparse";
import { useState } from "react";

const CsvUpload = () => {
  const [json, setJson] = useState(null);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const email = session?.user?.email;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type === "text/csv" &&
      selectedFile.size < 10 * 1024 * 1024
    ) {
      Papa.parse(selectedFile, {
        header: true,
        complete: (result) => {
          setJson(result.data);
          setError(""); // Clear any previous errors
        },
        error: () => {
          setError("Error parsing CSV file");
        },
      });
    } else {
      setError("Please select a valid CSV file (max size: 10MB).");
    }
  };

  const handleUpload = async () => {
    if (json && email) {
      await uploadFile(json, email);
    } else {
      setError("No file selected or email missing");
    }
  };

  const uploadFile = async (json, email) => {
    if (!json || !email) {
      setError("JSON data or email is missing");
      return;
    }

    // return;
    try {
      const response = await axios.post(
        "/api/products",
        {
          //   email,
          data: json,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("File uploaded successfully!", response.data);
      setError("");
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    } finally {
      //   setJson("");
    }
  };

  return (
    <Layout>
      <h2>Please upload your CSV File here</h2>
      <div className="flex gap-2">
        <Input
          id="Products"
          type="file"
          onChange={handleFileChange}
          className="w-full cursor-pointer"
        />
        <Button onClick={handleUpload} disabled={!json || json.length === 0}>
          {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
          Upload
        </Button>
      </div>
      <ProductTable productData={json} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Layout>
  );
};

export default CsvUpload;
