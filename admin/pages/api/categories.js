import { getCategoryIds, processCategories } from "@/lib/categoryService";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function newCategory(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);

  try {
    if (method === "GET") {
      const categories = await Category.find().populate("parent");
      res.json(categories);
    }

    if (method === "POST") {
      try {
        // Check if the request body data is an array
        const categories = Array.isArray(req.body) ? req.body : [req.body];

        // Validate categories
        categories.forEach((category) => {
          if (
            typeof category.name !== "string" ||
            (category.parentCategory !== undefined &&
              typeof category.parentCategory !== "string")
          ) {
            throw new TypeError("Invalid category data");
          }
        });

        // Normalize category names and fetch their IDs
        const categoryNames = [
          ...new Set(
            categories.flatMap((category) => [
              category.name.trim(),
              category.parentCategory?.trim() || "",
            ])
          ),
        ].filter((name) => name); // Remove empty strings

        // Fetch category IDs
        const categoryMap = await getCategoryIds(categoryNames);
        console.log("CATEGORY_MAP", categoryMap);

        // Process categories to create or update them
        const cateDoc = await processCategories(categoryMap, categories);
        console.log(cateDoc);

        // Respond with the processed categories
        res.status(201).json({
          message: `Categories processed successfully.`,
          data: cateDoc,
        });
      } catch (error) {
        console.error("Error processing categories:", error);
        res.status(400).json({ error: error.message });
      }
    }

    if (method === "PUT") {
      const { name, parentCategory, _id, properties } = req.body;

      // Ensure parentCategory is valid
      const parentCategoryId = parentCategory
        ? mongoose.Types.ObjectId.isValid(parentCategory)
          ? mongoose.Types.ObjectId(parentCategory)
          : null
        : null;

      // Perform update operation
      const cateDoc = await Category.updateOne(
        { _id },
        { name, parent: parentCategoryId, properties }
      );

      res.json(cateDoc);
    }

    if (method === "DELETE") {
      const deleteAll = req.query.all === "true";
      if (deleteAll) {
        await Category.deleteMany({});
        res.status(200).json({ message: "You have deleted all categories" });
        console.log("All categories deleted successfully");
      } else {
        const { _id } = req.query;
        await Category.deleteOne({ _id });
        res.json({ message: "Category deleted" });
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
}
