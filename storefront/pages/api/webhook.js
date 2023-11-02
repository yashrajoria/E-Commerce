import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { buffer } from "micro";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

async function Webhook(req, res) {
  await mongooseConnect();
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the eventx
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;

      const orderId = checkoutSessionCompleted.metadata.orderId;
      const paid = checkoutSessionCompleted.payment_status === "paid";

      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send("ok");
}

export default Webhook;
export const config = {
  api: { bodyParser: false },
};

//acct_1NcqhOSJp3lMZIOS
