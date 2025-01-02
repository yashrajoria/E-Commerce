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
    } else if (req.method === "PUT") {
      try {
        let orders;

        // Check if the request is for bulk update (isBulk should be a boolean)
        if (req.body.isBulk === true) {
          // Update multiple documents
          const result = await Order.updateMany(
            { email: req.body.email }, // Filter
            { $set: { status: req.body.status } } // Update
          );

          // To return matched and modified counts
          orders = {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
          };
        } else {
          // Update a single document
          orders = await Order.findOneAndUpdate(
            { email: req.body.email }, // Filter
            { $set: { status: req.body.status } }, // Update
            { new: true } // Return the updated document
          );
        }

        if (!orders) {
          return res.status(404).json({ message: "No matching orders found" });
        }

        res.status(200).json({
          message:
            req.body.isBulk === true
              ? "Bulk orders updated"
              : "Single order updated", // Correct message logic
          orders,
        });
      } catch (error) {
        console.error("Error updating orders:", error.stack || error);
        res.status(500).json({ message: "Internal server error" });
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
