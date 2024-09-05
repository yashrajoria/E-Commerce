import { Category } from "@/models/Category";
import mongoose from "mongoose";

/**
 * Fetch category IDs for a list of category names.
 * @param {Array<string>} categoryNames - List of category names.
 * @returns {Promise<Map<string, mongoose.Types.ObjectId>>} - A map of category names to IDs.
 */
export async function getCategoryIds(categoryNames) {
  // Ensure category names are unique
  const uniqueCategoryNames = [
    ...new Set(categoryNames.map((name) => name.trim())),
  ];

  // Fetch categories in one query
  const categories = await Category.find({
    name: { $in: uniqueCategoryNames },
  });

  // Create a map of category names to IDs
  const categoryMap = new Map();
  categories.forEach((category) => {
    categoryMap.set(category.name, category._id);
  });

  return categoryMap;
}
