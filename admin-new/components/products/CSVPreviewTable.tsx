import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export default function CSVPreviewTable({ csvData }: { csvData: any[] }) {
  return (
    <div className="rounded-lg border overflow-hidden">
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
              <TableHead className="w-[80px]">Sr. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-[200px]">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{product.Name}</TableCell>
                <TableCell>
                  {product.ImageURL ? (
                    <div className="h-12 w-12 rounded-md overflow-hidden border border-gray-200 dark:border-gray-800">
                      <Image
                        src={product.ImageURL || "/placeholder.svg"}
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
              <TableCell colSpan={6} className="text-right">
                Total Products: {csvData.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
