import { CreditCard, Package, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import Overview from "./Overview";
import { getProductData } from "./actions/getGraphData";
import { fetchOrderData, paidOrders } from "./actions/getOrderData";
function Chart() {
  const [orders, setOrders] = useState();
  const [count, setCount] = useState();
  const [orderValue, setOrderValue] = useState();
  const [productCount, setProductCount] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  useEffect(() => {
    const fetchOrderDataAndProcess = async () => {
      try {
        const data = await fetchOrderData();

        const productData = await getProductData();
        setProductCount(productData.data.products.length);
        setOrders(data);
        const { completedOrders, totalOrderValue } = paidOrders(data);
        setCompletedOrders(completedOrders);
        setCount(data.length);
        setOrderValue(totalOrderValue);
      } catch (error) {
        console.log("Product data not found", error);
      }
    };
    fetchOrderDataAndProcess();
  }, []);
  const cardsData = [
    { title: "Total Products", icon: Package, value: productCount },
    {
      title: "Total Orders",
      icon: ShoppingCart,
      value: count,
      orderDetails: [
        { unpaid: count - completedOrders, paid: completedOrders },
      ],
    },
    {
      title: "Total Revenue",
      icon: CreditCard,
      value: orderValue,
      currency: true,
    },
  ];
  return (
    <>
      <div className="flex flex-wrap mt-9 gap-4">
        {cardsData.map((card, index) => (
          <div className="w-full sm:w-1/2 lg:w-1/4" key={index}>
            <DashboardCard
              title={card.title}
              icon={card.icon}
              value={card.value}
              currency={card.currency}
              orderDetails={card.orderDetails}
            />
          </div>
        ))}
      </div>
      <div className="flex col-span-4 bg-white mt-7 rounded-md">
        <Overview />
      </div>
    </>
  );
}

export default Chart;
