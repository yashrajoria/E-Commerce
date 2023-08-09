import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState();
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      console.log(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="w-full mt-4">
        <thead className="bg-blue-100">
          <tr className="border p-1 border-blue-200">
            <th className="border p-1 border-blue-200">Date</th>
            <th className="border p-1 border-blue-200">Recipient</th>
            <th className="border p-1 border-blue-200">Products</th>
            <th className="border p-1 border-blue-200">Paid</th>
          </tr>
        </thead>
        <tbody>
          {orders?.length > 0 &&
            orders.map((order) => (
              <tr>
                <td>
                  {new Date(order.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour24: true,
                  })}
                </td>
                <td>
                  {order.name} {order.email} <br />
                  {order.city} {order.pCode} {order.country} <br />
                  {order.address} {order.phone}
                  <br />
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <>
                      {l.price_data?.product_data.name} x {l.quantity}
                      <br />
                    </>
                  ))}
                </td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "YES" : "NO"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default Orders;
