import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchOrderData, getRecentOrders } from "./actions/getOrderData";
import { TableComponent } from "./TableComponent";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Assuming ShadCN components

const Overview = () => {
  const [data, setData] = useState([]);
  const [recentOrder, setRecentOrder] = useState([]);
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetchOrderData();
        const data = await getRecentOrders();

        setRecentOrder(data);
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const combinedLineItems = response.reduce((acc, item) => {
          if (item.line_items) {
            const createdAtDate = new Date(item.createdAt);
            const monthName = monthNames[createdAtDate.getMonth()];

            item.line_items.forEach((line_item) => {
              const {
                price_data: {
                  product_data: { name },
                  unit_amount,
                },
              } = line_item;

              if (acc[monthName]) {
                acc[monthName] += unit_amount / 100;
              } else {
                acc[monthName] = unit_amount / 100;
              }
            });
          }
          return acc;
        }, {});

        const formattedData = Object.keys(combinedLineItems).map((key) => ({
          month: key,
          value: combinedLineItems[key],
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchGraphData();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row w-full gap-4 p-4">
      {/* Monthly Sales Overview Card */}
      <Card className="bg-white shadow-lg rounded-xl border border-gray-300 flex-1">
        <CardHeader className="bg-gray-50 p-4 border-b border-gray-200">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
            Monthly Sales Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <LineChart
            width={window.innerWidth > 640 ? 700 : window.innerWidth - 32}
            height={400}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis tick={{ fill: "#666", fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ stroke: "#4CAF50", strokeWidth: 2 }}
            />
          </LineChart>
        </CardContent>
      </Card>

      {/* Recent Orders Card */}
      <Card className="bg-white shadow-lg rounded-xl border border-gray-300 flex-1">
        <CardHeader className="bg-gray-50 p-4 border-b border-gray-200">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <TableComponent orders={recentOrder} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
