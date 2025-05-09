import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { ArrowDown, ArrowLeft, Plus, Upload } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
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
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import Papa from "papaparse";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
// Define form schema for single product
const singleProductSchema = z.object({
  title: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Stock quantity must be a non-negative number",
    }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});
interface Category {
  _id: string;
  name: string;
}
const AddProduct = () => {
  //   const { toast } = useToast();
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
      title: "",
      category: "",
      price: "",
      quantity: "",
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
      complete: function (results: Papa.ParseResult<never>) {
        setCsvData(results.data);
        setIsBulk(true);
        setBulkFile(file);
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: function (err: any) {
        console.error("Error parsing CSV:", err);
      },
    });
  };

  const onSubmitSingleProduct = async (
    data: z.infer<typeof singleProductSchema>
  ) => {
    try {
      // Send to your create product API
      const res = await axios.post("/api/products", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res.data, "Response from API");
      if (res.status === 200) {
        toast.success("Product created successfully!");
      } else {
        toast.error("Failed to create product.");
      }
      // Optional: show success toast / reset form
      // toast({ title: "Product Created!" });
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      setUploadedImage(null);
    } catch (error) {
      console.error("Error submitting product:", error);
      // toast({ title: "Error", description: error.message });
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

      const response = await axios.post(
        "/api/products/",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            isBulk: 1,
          },
          withCredentials: true,
        }
      );

      console.log({ response });
    } catch (err) {
      console.log(err);
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
          setCategories(res?.data);
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
        });
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1">
        <header className="backdrop-blur-lg sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="icon" asChild>
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
          >
            <motion.div className="mb-8">
              <Card className="bg-black shadow-amber-400 shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Add New Products</CardTitle>
                  <CardDescription>
                    Create single products or upload in bulk using a CSV file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue="single"
                    onValueChange={setActiveTab}
                    value={activeTab}
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-gray-500 rounded-lg p-1">
                      <TabsTrigger value="single">Single Product</TabsTrigger>
                      <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                    </TabsList>

                    <TabsContent value="single" className="space-y-4 mt-4">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmitSingleProduct)}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Section */}
                            <div className="space-y-4">
                              {/* Product Name */}
                              <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter product title"
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
                                  <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {categories.map(
                                          (category: Category) => (
                                            <SelectItem
                                              key={category?._id}
                                              value={category?.name}
                                            >
                                              {category?.name}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Price & Stock */}
                              <div className="grid grid-cols-2 gap-4">
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
                                          {...field}
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
                                        <Input type="number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Description */}
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Enter product description"
                                        className="min-h-[120px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Right Section: Image */}
                            <div className="space-y-4">
                              <Label>Product Image</Label>

                              <Tabs
                                value={uploadedImage || "file"}
                                onValueChange={(val) => setUploadedImage(val)}
                                className="w-full space-y-4"
                              >
                                {/* Tab Headers */}
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="file">
                                    Upload File
                                  </TabsTrigger>
                                  <TabsTrigger value="url">
                                    Use Image URL
                                  </TabsTrigger>
                                </TabsList>

                                {/* File Upload */}
                                <TabsContent value="file">
                                  <Input
                                    type="file"
                                    accept="image/*"
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
                                </TabsContent>

                                {/* URL Input */}
                                <TabsContent value="url">
                                  <Input
                                    placeholder="Enter Image URL"
                                    value={imagePreview || ""}
                                    onChange={(e) => {
                                      setImageFile(null);
                                      setImagePreview(e.target.value);
                                    }}
                                  />
                                </TabsContent>
                              </Tabs>

                              {/* Preview */}
                              {imagePreview && (
                                <div className="mt-2">
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="rounded-lg max-w-full h-auto border border-muted"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Submit */}
                          <div className="flex justify-end">
                            <Button type="submit" className="px-8">
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
                        <div className="flex items-center justify-between">
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="csv-upload">Upload CSV</Label>
                            <Input
                              id="csv-upload"
                              type="file"
                              accept=".csv"
                              onChange={handleFileUpload}
                            />
                          </div>
                          {/* Upload Button */}
                          <div>
                            <Button
                              onClick={handleBulkUpload}
                              disabled={!isBulk}
                              className="px-6 bg-amber-400 text-white"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload CSV
                            </Button>
                          </div>
                          <Button
                            // onClick={downloadSampleCSV}
                            className="rounded-full bg-blue-600 hover:bg-purple-800 cursor-pointer"
                            variant="destructive"
                          >
                            Download Sample CSV
                            <ArrowDown />
                          </Button>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">
                                Sr. No.
                              </TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Image</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Stock</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {csvData.map((product, index) => (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{product.Name}</TableCell>
                                <TableCell>
                                  <img
                                    src={product.ImageURL}
                                    alt={product.Name}
                                    className="h-12 w-12 object-cover rounded"
                                  />
                                </TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.Quantity}</TableCell>
                                <TableCell>{product.Description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>

                          <TableFooter></TableFooter>
                        </Table>
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
