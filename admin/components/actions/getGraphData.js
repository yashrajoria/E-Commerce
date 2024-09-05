import axios from "axios";

export const getProductData = async () => {
  try {
    const response = await axios.get("/api/products");

    return response;
  } catch (err) {
    console.log(err);
  }
};
