import { getCategoryIds } from "@/lib/categoryService";
import { mongooseConnect } from "@/lib/mongoose";
import { processProducts } from "@/lib/productService";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function newProduct(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);
  const page = req.query.page;
  const limit = req.query.limit;
  const skip = (page - 1) * limit;
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      const products = await Product.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Correct format
      const productCount = await Product.count();

      res.status(200).json({
        products: products,
        totalPages: Math.ceil(productCount / limit),
        currentPage: page,
      });
    }
  }
  if (method === "POST") {
    try {
      const isBulk = Array.isArray(req.body.data);

      const products = isBulk ? req.body.data : [req.body];

      // Gather all unique category names from the products
      const categoryNames = [
        ...new Set(products.map((product) => product.category)),
      ];

      // Fetch category IDs in bulk
      const categoryMap = await getCategoryIds(categoryNames);

      // Process all products
      const productDocs = await processProducts(products, categoryMap);

      res.json({
        message: `${products.length} product(s) successfully created.`,
        data: productDocs,
      });
    } catch (error) {
      console.error("Error creating products:", error);
      res.status(500).json({ message: "Error creating products", error });
    }
  }
  if (method === "PUT") {
    const { title, description, price, images, category, properties, _id } =
      req.body;
    // If the category value is an empty string, set it to null
    const updatedCategory = category === "" ? null : category;

    await Product.updateOne(
      { _id },
      {
        title,
        description,
        price,
        images,
        category: updatedCategory,
        properties,
      }
    );

    res.json(true);
    console.log(`Product created with name: ${title} successfully updated`);
  }

  if (method === "DELETE") {
    const title = req.query.id;
    const deleteAll = req.query.all === "true";
    if (deleteAll) {
      await Product.deleteMany({});
      res.status(200).json({ message: "You have deleted all products" });
      console.log("All products deleted successfully");
    }
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
      console.log(`Product created with name: ${title} successfully deleted`);
    }
  }
}
