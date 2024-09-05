import { Product } from "@/models/Product";
// Function to process products
export async function processProducts(products, categoryMap) {
  // Create products

  const productDocs = await Promise.all(
    products.map(async (product) => {
      const {
        title,
        description,
        price,
        images,
        category: categoryNameOrId,
        properties,
      } = product;
      const normalizedImages = Array.isArray(images) ? images : [images];

      // Determine category ID from map or use provided ID directly
      const categoryId = categoryMap.get(categoryNameOrId) || categoryNameOrId;

      // Create the product
      const productDoc = await Product.create({
        title,
        description,
        price: Number(price),
        images: normalizedImages,
        category: categoryId,
        properties,
      });

      return productDoc;
    })
  );

  return productDocs;
}
