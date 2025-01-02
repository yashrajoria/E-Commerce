import ProductsGrid from "./ProductsGrid";

function NewProducts({ products }) {
  return (
    // <Center>
    <>
      <h2 className="text-3xl m-2  font-bold text-white">New Arrivals</h2>
      <ProductsGrid products={products} />
    </>
  );
}

export default NewProducts;
