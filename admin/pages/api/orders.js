import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Orders";

async function getOrders(req, res) {
  await mongooseConnect();

  try {
    if (req.method === "POST") {
      const {
        line_items,
        name,
        email,
        city,
        pCode,
        address,
        country,
        phone,
        paid,
      } = req.body;

      try {
        const paidValue = paid === "true" || paid === true;

        const order = await Order.create({
          line_items,
          name,
          email,
          city,
          pCode,
          address,
          country,
          phone,
          paid: paidValue,
        });

        res
          .status(201)
          .json({ message: `Order created successfully for ${name}` });
      } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order" });
      }
    } else if (req.method === "GET") {
      try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders" });
      }
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Unexpected server error" });
  }
}

export default getOrders;
