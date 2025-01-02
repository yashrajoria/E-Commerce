import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Badge } from "./ui/badge";
const OrderStatusDropdown = ({ order, email }) => {
  console.log(order);
  const [status, setStatus] = useState(order);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    axios
      .put("api/orders/", {
        status: newStatus,
        email: email,
      })
      .then((response) => {
        console.log("Order updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  };
  // Assigning color classes based on the status
  const statusClasses = {
    "In Progress": "bg-blue-400 text-white",
    Shipped: "bg-indigo-500 text-white",
    "Out For Delivery": "bg-green-600 text-white",
    Delivered: "bg-gray-600 text-white",
    Cancelled: "bg-red-600 text-white",
  };

  return (
    <td className="p-2 text-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`${statusClasses[status]} p-2 rounded-lg text-center w-full cursor-pointer transition-colors duration-300`}
        >
          {status}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleStatusChange("In Progress")}>
            <Badge className="bg-yellow-500 text-white">In Progress</Badge>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("Shipped")}>
            <Badge className="bg-blue-500 text-white">Shipped</Badge>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange("Out For Delivery")}
          >
            <Badge className="bg-green-500 text-white">Out For Delivery</Badge>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("Delivered")}>
            <Badge className="bg-gray-500 text-white">Delivered</Badge>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("Cancelled")}>
            <Badge className="bg-red-500 text-white">Cancelled</Badge>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </td>
  );
};

export default OrderStatusDropdown;
