"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  RefreshCw,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Status icons mapping
const statusIcons = {
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  processing: <RefreshCw className="h-4 w-4 text-blue-400" />,
  shipped: <Truck className="h-4 w-4 text-violet-500" />,
  delivered: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  cancelled: <XCircle className="h-4 w-4 text-rose-500" />,
};

// Status badge styling
const getStatusBadgeStyle = (status) => {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    processing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    shipped: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return styles[status] || styles["pending"];
};

const OrderDetails = () => {
  // Mock order data - replace with actual API call
  const [order, setOrder] = useState({
    _id: "ord-001",
    orderNumber: "ORD-2023-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2023-05-15T10:30:00",
    total: 129.99,
    subtotal: 119.99,
    tax: 10.0,
    shipping: 0,
    discount: 0,
    items: [
      {
        _id: "item-001",
        name: "Premium Wireless Headphones",
        sku: "SKU-001",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        _id: "item-002",
        name: "Smart Fitness Tracker",
        sku: "SKU-002",
        price: 39.99,
        quantity: 1,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    status: "delivered",
    paymentMethod: "Credit Card",
    paymentId: "PAY-123456789",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    billingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    trackingNumber: "TRK-987654321",
    notes: "Please leave the package at the front door.",
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      // In a real app, you would call your API here
      // await axios.patch(`/api/orders/${order._id}`, { status: newStatus })

      // For demo, we'll update the state directly
      setOrder({ ...order, status: newStatus });

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-white/10 bg-card/30 backdrop-blur-lg sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/orders">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 transition-all duration-200 hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Orders</span>
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Order Details</h1>
              <Badge className="bg-blue-400 hover:bg-blue-500 transition-all">
                {order.orderNumber}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Select
                defaultValue={order.status}
                onValueChange={handleStatusUpdate}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Order Status */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground">
                  Order Status
                </div>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 px-3 py-1.5 text-base capitalize ${getStatusBadgeStyle(
                    order.status
                  )}`}
                >
                  {statusIcons[order.status]}
                  {order.status}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground">Order Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(order.date)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground">
                  Payment Method
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{order.paymentMethod}</span>
                </div>
              </div>
              {order.trackingNumber && (
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-muted-foreground">
                    Tracking Number
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{order.trackingNumber}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="md:col-span-2">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Image</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow
                            key={item._id}
                            className="group transition-all duration-200 hover:bg-muted/30"
                          >
                            <TableCell>
                              <div className="h-12 w-12 rounded-md bg-white/10 overflow-hidden">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="mt-6 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                      )}
                      {order.shipping > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Shipping
                          </span>
                          <span>${order.shipping.toFixed(2)}</span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Discount
                          </span>
                          <span>-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer and Shipping Info */}
              <div className="space-y-6">
                {/* Customer Info */}
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Customer Information
                    </CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-white/10 overflow-hidden">
                        <img
                          src={order.customer.avatar || "/placeholder.svg"}
                          alt={order.customer.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer.email}
                        </div>
                      </div>
                    </div>
                    {order.customer.phone && (
                      <div className="text-sm">
                        <div className="text-muted-foreground mb-1">
                          Phone Number
                        </div>
                        <div>{order.customer.phone}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Shipping Address
                    </CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Billing Address
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>{order.billingAddress.street}</p>
                      <p>
                        {order.billingAddress.city},{" "}
                        {order.billingAddress.state}{" "}
                        {order.billingAddress.zipCode}
                      </p>
                      <p>{order.billingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {order.notes && (
                  <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-base font-medium">
                        Order Notes
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">{order.notes}</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="outline">Print Invoice</Button>
              <Button variant="outline">Email Customer</Button>
              <Button className="bg-blue-400 hover:bg-blue-500 transition-all duration-200 hover:scale-105">
                Process Refund
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetails;
