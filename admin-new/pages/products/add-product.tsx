"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, Plus, Upload, X, ImageIcon } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import Papa from "papaparse";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Define form schema for single product
const singleProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be a positive number"),

  quantity: z
    .number({
      required_error: "quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .positive("quantity must be a positive number"),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

interface Category {
  _id: string;
  name: string[];
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const AddProduct = () => {
  const [activeTab, setActiveTab] = useState("single");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isBulk, setIsBulk] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  // Form definition for single product
  const form = useForm<z.infer<typeof singleProductSchema>>({
    resolver: zodResolver(singleProductSchema),
    defaultValues: {
      name: "",
      category: [],
      price: 0,
      quantity: 0,
      description: "",
      images: [],
    },
  });

  const handleFileUpload = (event: { target: { files: unknown[] } }) => {
    const file = event.target.files?.[0];
    console.log(file, "FILE");
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<never>) => {
        setCsvData(results.data);
        setIsBulk(true);
        setBulkFile(file);
        toast.success("CSV file loaded successfully!");
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (err: any) => {
        console.error("Error parsing CSV:", err);
        toast.error("Error parsing CSV file");
      },
    });
  };

  const onSubmitSingleProduct = async (
    data: z.infer<typeof singleProductSchema>
  ) => {
    console.log({ data });
    try {
      // Send to your create product API
      const res = await axios.post("/api/products", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res.data, "Response from API");

      if (res.status === 201) {
        toast.success("Product created successfully!");
      } else {
        toast.error("Failed to create product.");
      }
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      setUploadedImage(null);
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Error creating product");
    }
  };

  const handleBulkUpload = async () => {
    try {
      if (!bulkFile) {
        toast.error("Please upload a CSV file first.");
        return;
      }

      const formData = new FormData();
      formData.append("file", bulkFile);

      const response = await axios.post("/api/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          isBulk: 1,
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success("Products uploaded successfully!");
        setCsvData([]);
        setBulkFile(null);
        setIsBulk(false);
      } else {
        toast.error("Failed to upload products");
      }

      console.log({ response });
    } catch (err) {
      console.log(err);
      toast.error("Error uploading products");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      await axios
        .get("/api/categories", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setCategories(res.data.map((cat: Category) => cat.name));
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
          toast.error("Failed to load categories");
        });
    };
    fetchCategories();
  }, []);

  const downloadSampleCSV = () => {
    const sampleData = [
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

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1">
        <header className="backdrop-blur-lg sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 border-b">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="rounded-full"
              >
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">Add Products</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          <motion.div
            className="max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div className="mb-8" variants={fadeIn}>
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-500" />
                    Add New Products
                  </CardTitle>
                  <CardDescription>
                    Create single products or upload in bulk using a CSV file
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs
                    defaultValue="single"
                    onValueChange={setActiveTab}
                    value={activeTab}
                    className="space-y-6"
                  >
                    <TabsList className="grid w-full grid-cols-2 rounded-lg p-1">
                      <TabsTrigger
                        value="single"
                        className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
                      >
                        Single Product
                      </TabsTrigger>
                      <TabsTrigger
                        value="bulk"
                        className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
                      >
                        Bulk Upload
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="single" className="space-y-6 mt-4">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmitSingleProduct)}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Section */}
                            <div className="space-y-6">
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                                  PRODUCT DETAILS
                                </h3>

                                {/* Product Name */}
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem className="mb-4">
                                      <FormLabel>Product Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter product name"
                                          className="bg-white dark:bg-gray-950"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {/* Category */}
                                <FormField
                                  control={form.control}
                                  name="category"
                                  render={({ field }) => (
                                    <FormItem className="mb-4">
                                      <FormLabel>Categories</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <Select
                                            value=""
                                            onValueChange={(value) => {
                                              if (
                                                !field.value.includes(value)
                                              ) {
                                                field.onChange([
                                                  ...field.value,
                                                  value,
                                                ]);
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="w-full bg-white dark:bg-gray-950">
                                              <SelectValue placeholder="Select categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {categories.map((category) => (
                                                <SelectItem
                                                  key={category}
                                                  value={category}
                                                >
                                                  {category}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                          {/* Show selected items */}
                                          <div className="flex flex-wrap mt-3 gap-2">
                                            {field.value.map((val: string) => (
                                              <Badge
                                                key={val}
                                                variant="secondary"
                                                className="px-2 py-1 text-sm rounded-full flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                              >
                                                {val}
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    field.onChange(
                                                      field.value.filter(
                                                        (item: string) =>
                                                          item !== val
                                                      )
                                                    )
                                                  }
                                                  className="ml-1 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/30 p-0.5"
                                                >
                                                  <X className="h-3 w-3" />
                                                </button>
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {/* Price & Stock */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            className="bg-white dark:bg-gray-950"
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                e.target.valueAsNumber
                                              )
                                            }
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            className="bg-white dark:bg-gray-950"
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                e.target.valueAsNumber
                                              )
                                            }
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>

                              {/* Description */}
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                                  PRODUCT DESCRIPTION
                                </h3>
                                <FormField
                                  control={form.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Enter product description"
                                          className="min-h-[150px] bg-white dark:bg-gray-950"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            {/* Right Section: Image */}
                            <div className="space-y-6">
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                                  PRODUCT IMAGE
                                </h3>

                                <Tabs
                                  value={uploadedImage || "file"}
                                  onValueChange={(val) => setUploadedImage(val)}
                                  className="w-full space-y-4"
                                >
                                  {/* Tab Headers */}
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                      value="file"
                                      className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
                                    >
                                      Upload File
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="url"
                                      className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
                                    >
                                      Use Image URL
                                    </TabsTrigger>
                                  </TabsList>

                                  {/* File Upload */}
                                  <TabsContent
                                    value="file"
                                    className="space-y-4"
                                  >
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                                      <div className="mb-4 flex justify-center">
                                        <ImageIcon className="h-10 w-10 text-gray-400" />
                                      </div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        Drag and drop your image here or click
                                        to browse
                                      </p>
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        className="bg-white dark:bg-gray-950"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (
                                            file &&
                                            file.type.startsWith("image/")
                                          ) {
                                            setImageFile(file);
                                            setImagePreview(
                                              URL.createObjectURL(file)
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                  </TabsContent>

                                  {/* URL Input */}
                                  <TabsContent value="url">
                                    <Input
                                      placeholder="Enter Image URL"
                                      className="bg-white dark:bg-gray-950"
                                      value={imagePreview || ""}
                                      onChange={(e) => {
                                        setImageFile(null);
                                        setImagePreview(e.target.value);
                                      }}
                                    />
                                  </TabsContent>
                                </Tabs>

                                {/* Preview */}
                                {imagePreview ? (
                                  <div className="mt-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                      Preview:
                                    </p>
                                    <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                                      <img
                                        src={imagePreview || "/placeholder.svg"}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setImagePreview(null);
                                          setImageFile(null);
                                        }}
                                        className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 p-1 rounded-full hover:bg-white dark:hover:bg-black"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-4 aspect-square w-full max-w-[300px] mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-400 dark:text-gray-600 text-sm">
                                      No image selected
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <Separator className="my-6" />

                          {/* Submit */}
                          <div className="flex justify-end">
                            <Button
                              type="submit"
                              className="px-8 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create Product
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </TabsContent>

                    <TabsContent value="bulk" className="space-y-6 mt-4">
                      <div className="space-y-6">
                        {/* File Upload Section */}
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
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-lg border overflow-hidden"
                          >
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b">
                              <h3 className="font-medium">CSV Preview</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {csvData.length} products ready to upload
                              </p>
                            </div>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[80px]">
                                      Sr. No.
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead className="w-[200px]">
                                      Description
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {csvData.map((product, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">
                                        {index + 1}
                                      </TableCell>
                                      <TableCell>{product.Name}</TableCell>
                                      <TableCell>
                                        {product.ImageURL ? (
                                          <div className="h-12 w-12 rounded-md overflow-hidden border border-gray-200 dark:border-gray-800">
                                            <img
                                              src={
                                                product.ImageURL ||
                                                "/placeholder.svg"
                                              }
                                              alt={product.Name}
                                              className="h-full w-full object-cover"
                                            />
                                          </div>
                                        ) : (
                                          <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                                            <ImageIcon className="h-6 w-6 text-gray-400" />
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell>${product.price}</TableCell>
                                      <TableCell>{product.Quantity}</TableCell>
                                      <TableCell className="max-w-[200px] truncate">
                                        {product.Description}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                                <TableFooter>
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      className="text-right"
                                    >
                                      Total Products: {csvData.length}
                                    </TableCell>
                                  </TableRow>
                                </TableFooter>
                              </Table>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-12 text-center">
                            <div className="flex justify-center mb-4">
                              <Upload className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                              No CSV File Uploaded
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                              Upload a CSV file to see a preview of your
                              products here. Make sure your CSV has the correct
                              format.
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
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
