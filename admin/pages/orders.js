import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState();
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1 className="text-blue-900 text-xl font-bold mb-2">Orders</h1>
      <table className="w-full mt-4">
        <thead className="bg-blue-100">
          <tr className="border p-1 border-blue-200">
            <th className="border p-1 border-blue-200">Date</th>
            <th className="border p-1 border-blue-200">Recipient</th>
            <th className="border p-1 border-blue-200">Products</th>
            <th className="border p-1 border-blue-200">Paid</th>
            <th className="border p-1 border-blue-200">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders?.length > 0 &&
            orders.map((order) => (
              <tr key={order.createdAt}>
                <td className="text-center">
                  {new Date(order.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour24: true,
                  })}
                </td>
                <td className="text-center">
                  {order.name} {order.email} <br />
                  {order.city} {order.pCode} {order.country} <br />
                  {order.address} {order.phone}
                  <br />
                </td>
                <td className="text-center">
                  {order.line_items.map((l, indexID) => (
                    <React.Fragment key={indexID}>
                      {l.price_data?.product_data.name} x {l.quantity}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td
                  className={
                    order.paid
                      ? "text-green-600 text-center"
                      : "text-red-600 text-center"
                  }
                >
                  {order.paid ? "YES" : "NO"}
                </td>
                <td className="text-center">
                  ₹
                  {order.line_items
                    .reduce((sum, total) => {
                      const value = total.price_data?.unit_amount / 100;
                      const formattedValue =
                        typeof value === "number" ? value.toFixed(2) : "0.00";
                      return sum + parseFloat(formattedValue);
                    }, 0)
                    .toLocaleString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default Orders;
