import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    city: String,
    email: String,
    pCode: String,
    address: String,
    pCode: String,
    phone: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);
export const Order = models.Product || model("Order", OrderSchema);
