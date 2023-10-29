import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Orders";

async function getOrders(req, res) {
  try {
    await mongooseConnect();
    res.json(await Order.find().sort({ createdAt: -1 }));
  } catch (err) {
    console.log("Error fetching products", err);
  }
}

export default getOrders;
