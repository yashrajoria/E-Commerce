import mongoose from "mongoose";

// Define the schema for Product
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    properties: { type: Object },
    quantity: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

// Export the model, checking if it already exists in the models collection
const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema, "products");

export default Product;
