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
  },
  {
    timestamps: true,
  }
);

export const Order = model("Order", OrderSchema);
