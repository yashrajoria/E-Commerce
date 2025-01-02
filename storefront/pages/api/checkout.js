import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function Checkout(req, res) {
  if (req.method !== "POST") {
    res.json("Should be a post request");
    return;
  }

  try {
    const { name, email, city, pCode, address, country, phone, cartProducts } =
      req.body;

    await mongooseConnect();

    const productIds = cartProducts;
    const uniqueIds = [...new Set(productIds)];

    const productsInfos = await Product.find({ _id: { $in: uniqueIds } });

    let line_items = [];

    for (const productId of uniqueIds) {
      const productInfo = productsInfos.find(
        (p) => p._id.toString() === productId
      );
      const quantity = productIds.filter((id) => id === productId)?.length || 0;

      if (quantity > 0 && productInfo) {
        line_items.push({
          quantity,
          price_data: {
            currency: "INR",
            product_data: { name: productInfo.title },
            unit_amount: quantity * productInfo.price * 100,
          },
        });
      }
    }

    const orderDoc = await Order.create({
      line_items,
      name,
      email,
      city,
      pCode,
      address,
      country,
      phone,
      paid: false,
      status: "In Progress",
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer_email: email,
      success_url: process.env.PUBLIC_URL + "cart?success=1",
      cancel_url: process.env.PUBLIC_URL + "cart?cancelled=1",
      metadata: {
        orderId: orderDoc._id.toString(),
        test: "ok",
      },
    });

    res.json({
      url: session.url,
      order_id: session?.metadata?.orderId,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
}

export default Checkout;
