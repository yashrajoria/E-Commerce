import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
const statusClasses = {
  "In Progress": "bg-orange-400 text-white",
  Shipped: "bg-indigo-500 text-white",
  "Out For Delivery": "bg-gray-600 text-white",
  Delivered: "bg-green-600 text-white",
  Cancelled: "bg-red-600 text-white",
};
export const TableComponent = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Payment</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Contact</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={index} className="bg-white odd:bg-gray-100">
              <TableCell className="font-medium">{order.name}</TableCell>
              <TableCell>
                {order.isPaid ? (
                  <Badge className="bg-green-600 text-white">Yes</Badge>
                ) : (
                  <Badge className="bg-red-600 text-white">No</Badge>
                )}
              </TableCell>
              <TableCell>₹ {order.total}</TableCell>
              <TableCell className="text-right">{order.contact_no}</TableCell>
              <TableCell className="text-right">{order.date}</TableCell>
              <Badge
                className={`${
                  statusClasses[order.status]
                } text-center w-full mt-2 justify-center`}
              >
                {order.status}
              </Badge>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
