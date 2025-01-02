import Header from "@/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getSession } from "next-auth/react";
import { getOrders } from "@/aggregations/orderAggregations";

const MyOrders = ({ orders }) => {
  const headersObject = {
    order_data: "Products",
    amount: "Amount",
    paid: "Paid",
    createdAt: "Created At",
    status: "Status",
  };

  const headers = Object.keys(headersObject);
  console.log(orders);
  const renderCellContent = (value, header) => {
    if (header === "order_data") {
      if (Array.isArray(value)) {
        const orderItems = value
          .map((val) => `${val.name} ${val.quantity} X ${val.price}`)
          .join(" ; ");
        return orderItems;
      }
    } else if (header === "createdAt") {
      const localTime = new Date(value).toLocaleDateString("en-GB");

      const newValue = localTime;
      return newValue;
    } else if (header === "paid") {
      return (
        <Badge
          className={
            value === "Yes"
              ? "bg-green-700 text-white"
              : "bg-red-700 text-white"
          }
        >
          {value}
        </Badge>
      );
    } else if (header === "Status") {
      return value;
    }
    return value;
  };

  return (
    <>
      <Header />

      <div className="overflow-x-auto pt-4 bg-[#fdfaf3]">
        <h1 className="text-3xl font-bold text-[#4d3b2f] mb-6 text-center">
          My Orders
        </h1>
        <Table className="min-w-full bg-[#f9f5eb] border border-[#e0d9cf] rounded-lg shadow-md">
          <TableHeader>
            <TableRow className="bg-[#d9a084]">
              {headers.map((header) => (
                <TableHead
                  key={header}
                  className="py-3 px-4 text-left text-white uppercase text-sm font-medium tracking-wide"
                >
                  {headersObject[header]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow
                key={order._id}
                className={`transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-[#f1ede3]" : "bg-[#f9f5eb]"
                } hover:bg-[#e6d2b3]`}
              >
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    className="py-2 px-4 text-left text-[#4d3b2f] border-b border-[#e0d9cf]"
                  >
                    {renderCellContent(order[header], header)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default MyOrders;

export async function getServerSideProps(context) {
  await mongooseConnect();
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/", // Redirect to sign-in page if not authenticated
        permanent: false,
      },
    };
  }

  try {
    const email = session.user.email;

    const orderAggregation = await getOrders(email);
    // console.log(orderAggregation);
    return {
      props: {
        orders: JSON.parse(JSON.stringify(orderAggregation)),
      },
    };
    const orders = await Order.find({ email: email }).select(
      "line_items createdAt paid status"
    );

    // Process orders to format content
    const formattedOrders = orders.map((order) => {
      const lineItems = order.line_items
        .map(
          (item) => `${item.quantity} x ${item.price_data.product_data.name}`
        )
        .join("; "); // Join items into a single string

      const totalAmount = order.line_items
        .reduce(
          (sum, item) =>
            sum + (item.price_data.unit_amount / 100) * item.quantity,
          0
        )
        .toFixed(2); // Sum up and format to two decimal places

      // Assuming the currency is the same for all items in the order
      const currency = order.line_items[0]?.price_data.currency || "INR";
      const isPaid = order.paid;
      const status = order.status;
      console.log(order.createdAt);
      return {
        ...order,
        line_items: lineItems,
        createdAt: new Date(order.createdAt).toLocaleDateString(),
        amount: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(totalAmount),
        paid: isPaid ? "Yes" : "No",
        status: status,
      };
    });

    return {
      props: {
        orders: JSON.parse(JSON.stringify(formattedOrders)),
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      props: {
        orders: [],
      },
    };
  }
}
