import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

async function getCartProducts(req, res) {
  try {
    await mongooseConnect();

    const ids = req.body.ids;
    const cartProducts = await Product.find({ _id: ids });

    res.json(cartProducts);
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching cart products." });
  }
}

export default getCartProducts;
