import ProductBox from "./ProductBox";

export default function ProductsGrid({ products }) {
  return (
    <>
      <div className="p-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {products?.length > 0 &&
          products.map((product) => (
            <ProductBox {...product} key={product._id} />
          ))}
      </div>
    </>
  );
}
