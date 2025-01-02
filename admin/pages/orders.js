import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import OrderStatusDropdown from "@/components/OrderStatus";
function Orders() {
  const [orders, setOrders] = useState();
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  const tableHeaderMap = [
    {
      name: "Name",
      email: "Email",
      address: "Address",
      date: "Date",
      products: "Products",
      paid: "Paid",
      total: "Total",
      status: "Status",
    },
  ];

  const tableHeaders = Object.keys(tableHeaderMap[0]);

  return (
    <Layout>
      <h1 className="text-blue-900 text-xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-blue-100">
            <tr className="border-b">
              {tableHeaders.map((tableHeader) => (
                <th className="p-2 text-left" key={tableHeader}>
                  {tableHeaderMap[0][tableHeader]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 &&
              orders.map((order) => (
                <tr key={order.createdAt} className="border-b">
                  <td className="p-2 text-center">{order.name}</td>
                  <td className="p-2 text-center">{order.email}</td>
                  <td className="p-2 text-center">
                    {order.city} {order.pCode} {order.country}
                    <br />
                    {order.address}
                    <br />
                    {order.phone}
                  </td>
                  <td className="p-2 text-center">
                    {new Date(order.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour24: true,
                    })}
                  </td>
                  <td className="p-2 text-center">
                    {order.line_items.map((l, indexID) => (
                      <React.Fragment key={indexID}>
                        {l.price_data?.product_data.name} x {l.quantity}
                        <br />
                      </React.Fragment>
                    ))}
                  </td>
                  <td
                    className={`p-2 text-center ${
                      order.paid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {order.paid ? "YES" : "NO"}
                  </td>
                  <td className="p-2 text-center">
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
                  <td className="p-2 text-center">
                    <OrderStatusDropdown
                      order={order.status}
                      email={order.email}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Cards */}
      <div className="block md:hidden mt-4">
        {orders?.length > 0 &&
          orders.map((order) => (
            <div
              key={order.createdAt}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
            >
              <div className="mb-2 font-semibold text-blue-900">
                {order.name}
              </div>
              <div className="text-gray-700">{order.email}</div>
              <div className="text-gray-700">
                {order.city} {order.pCode} {order.country}
                <br />
                {order.address}
                <br />
                {order.phone}
              </div>
              <div className="text-gray-700 mt-2">
                {new Date(order.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour24: true,
                })}
              </div>
              <div className="text-gray-700 mt-2">
                {order.line_items.map((l, indexID) => (
                  <div key={indexID}>
                    {l.price_data?.product_data.name} x {l.quantity}
                  </div>
                ))}
              </div>
              <div
                className={`text-center mt-2 ${
                  order.paid ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.paid ? "Paid" : "Not Paid"}
              </div>
              <div className="text-center mt-2">
                ₹
                {order.line_items
                  .reduce((sum, total) => {
                    const value = total.price_data?.unit_amount / 100;
                    const formattedValue =
                      typeof value === "number" ? value.toFixed(2) : "0.00";
                    return sum + parseFloat(formattedValue);
                  }, 0)
                  .toLocaleString()}
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
}

export default Orders;
