import { Schema, model, models } from "mongoose";

const StoreUsersSchema = new Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_id: { type: String, required: true },
    address: {
      address_line_1: { type: String },
      address_line_2: { type: String },
      city: { type: String },
      postal_code: { type: String },
      state: { type: String },
      country: { type: String },
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const StoreUsers =
  models.StoreUsers || model("StoreUsers", StoreUsersSchema, "storeUsers");
