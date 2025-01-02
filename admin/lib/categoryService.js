import { Category } from "@/models/Category";
import mongoose from "mongoose";

/**
 * Fetch category IDs for a list of category names.
 * @param {Array<string>} categoryNames - List of category names.
 * @returns {Promise<Map<string, mongoose.Types.ObjectId>>} - A map of category names to IDs.
 */
export async function getCategoryIds(categoryNames) {
  console.log({ categoryNames });
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

// /**
//  * Process and create or update categories based on the category map.
//  * @param {Map<string, mongoose.Types.ObjectId>} categoryMap - A map of category names to IDs.
//  * @param {Array<Object>} categories - Array of category objects to be created or updated.
//  * @returns {Promise<Array<Object>>} - List of created or updated category documents.
//  */
export async function processCategories(categoryMap, categories) {
  const result = {
    created: 0,
    updated: 0,
    parentAssigned: 0,
    warnings: [],
    errors: [],
  };

  try {
    // Convert categoryMap to a plain object for easier access
    const categoryMapObj = Object.fromEntries(categoryMap);

    // Phase 1: Create or update categories without parent assignments
    const bulkOperations = [];

    for (const category of categories) {
      const { name, properties } = category;

      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        // Check if properties need updating
        if (
          JSON.stringify(existingCategory.properties) !==
          JSON.stringify(properties)
        ) {
          bulkOperations.push({
            updateOne: {
              filter: { name },
              update: { $set: { properties } },
            },
          });
          console.log(`Queued update for category: ${name}`);
          result.updated++;
        }
      } else {
        // Create new category
        bulkOperations.push({
          insertOne: {
            document: { name, properties },
          },
        });
        console.log(`Queued creation for category: ${name}`);
        result.created++;
      }
    }

    // Execute bulk write for phase 1
    if (bulkOperations.length > 0) {
      await Category.bulkWrite(bulkOperations);
      console.log("Bulk operation for phase 1 completed.");
    }

    // Phase 2: Assign parent categories once all categories are created
    const parentOps = [];

    for (const category of categories) {
      const { name, parentCategory } = category;

      if (parentCategory) {
        const parent = await Category.findOne({ name: parentCategory });

        if (parent) {
          parentOps.push({
            updateOne: {
              filter: { name },
              update: { $set: { parent: parent._id } },
            },
          });
          console.log(`Queued parent assignment for category: ${name}`);
          result.parentAssigned++;
        } else {
          const warningMessage = `Parent category ${parentCategory} not found for ${name}`;
          console.warn(warningMessage);
          result.warnings.push(warningMessage);
        }
      }
    }

    // Execute bulk write for parent assignments
    if (parentOps.length > 0) {
      await Category.bulkWrite(parentOps);
      console.log("Bulk operation for phase 2 completed.");
    }
  } catch (error) {
    console.error("Error processing categories:", error);
    result.errors.push(error.message);
  }

  return result;
}
