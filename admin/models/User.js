import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  image: { type: String },
});

export const User = mongoose.models.User || model("User", UserSchema);
