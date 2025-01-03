import mongoose, { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    city: String,
    email: String,
    pCode: String,
    address: String,
    phone: String,
    paid: Boolean,
    status: String,
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists, otherwise create it
export const Order = mongoose.models.Order || model("Order", OrderSchema);
