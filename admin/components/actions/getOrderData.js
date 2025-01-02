import axios from "axios";

export const fetchOrderData = async () => {
  try {
    const response = await axios.get("/api/orders");

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const paidOrders = (data) => {
  try {
    let completedOrders = 0;
    let totalAmount = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].paid === true) {
        completedOrders++;
        data[i].line_items.forEach((item) => {
          totalAmount += item.price_data.unit_amount * item.quantity;
        });
      }
    }

    const totalOrderValue = (totalAmount / 100).toLocaleString();

    return {
      completedOrders,
      totalOrderValue,
      // orderMonth,
    };
  } catch (error) {
    console.error("Error processing orders:", error);
    throw error;
  }
};

export const getRecentOrders = async () => {
  const response = await fetchOrderData();
  let recentOrder = [];

  for (let i = 0; i < response.length; i++) {
    let totalAmount = 0; // Initialize totalAmount for each specific order

    // Calculate total amount for this specific order
    response[i].line_items.forEach((item) => {
      totalAmount += item.price_data.unit_amount * item.quantity;
    });

    const totalOrderValue = (totalAmount / 100).toLocaleString();
    const { name, paid, createdAt, phone, status } = response[i];
    const orderDate = new Date(createdAt).toLocaleString();

    recentOrder.push({
      name: name,
      isPaid: paid,
      date: orderDate,
      total: totalOrderValue,
      contact_no: phone,
      status: status,
    });
  }

  // Limit to only the 5 most recent orders
  recentOrder = recentOrder.slice(0, 6);

  // Format the date for display
  recentOrder = recentOrder.map((order) => ({
    ...order,
    date: order.date.toLocaleString(),
  }));

  return recentOrder;
};
