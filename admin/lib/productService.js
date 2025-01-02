import { Product } from "@/models/Product";

export async function processProducts(products, categoryMap) {
  const result = {
    created: 0,
    errors: [],
    productDocs: [],
  };

  try {
    // Process products and create them
    result.productDocs = await Promise.all(
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
        const categoryId =
          categoryMap.get(categoryNameOrId) || categoryNameOrId;

        try {
          // Create the product
          const productDoc = await Product.create({
            title,
            description,
            price: Number(price),
            images: normalizedImages,
            category: categoryId,
            properties,
          });

          console.log(`Created product: ${productDoc.title}`);
          result.created++;
          return productDoc;
        } catch (error) {
          console.error(`Error creating product ${title}:`, error);
          result.errors.push({ title, error: error.message });
          return null;
        }
      })
    );

    console.log(`Products processed. Total created: ${result.created}`);
  } catch (error) {
    console.error("Error processing products:", error);
    result.errors.push({ error: error.message });
  }

  return result;
}
