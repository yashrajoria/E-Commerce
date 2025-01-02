import { CartContext } from "@/components/CartContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

function Cart({ session }) {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [pCode, setpCode] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (window.location.href.includes("success")) {
      clearCart();

      localStorage.removeItem("cart");

      setIsSuccess(true);
    }
  }, []);

  function moreOfThisProduct(id) {
    addProduct(id);
  }
  function lessOfThisProduct(id) {
    removeProduct(id);
  }
  let total = 0;

  //!TODO: Also calculate total number of products

  let totalQuantity = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;

    total += price;
  }
  totalQuantity += cartProducts.length;

  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      city,
      pCode,
      country,
      address,
      phone,
      cartProducts,
    });
    console.log(response.data);

    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  useEffect(() => {
    if (isSuccess) {
      async function sendEmailToCustomer() {
        const getData = await axios.get("/api/auth/session");
        await axios.post("/api/email", {
          to: getData.data.user.email,
          subject: "Order Confirmation",
          body: `Your order has been confirmed. Products ${cartProducts}`,
        });
      }

      sendEmailToCustomer();
    }
  }, [isSuccess]);

  if (isSuccess) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
            Thank You for Your Payment!
          </h1>
          <p className="text-center text-lg font-medium text-green-600">
            Your order has been confirmed.
            <a
              href="/my-orders"
              className="text-blue-500 hover:text-blue-700 underline ml-1"
            >
              View Your Orders
            </a>
            <p>A confirmation has been sent to your email</p>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Cart</h2>

        {!cartProducts?.length ? (
          <h4 className="text-center text-lg font-medium text-gray-500">
            Your cart is empty
          </h4>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Products Table */}
            <div className="flex-1 overflow-x-auto shadow-md rounded-lg bg-white">
              <Table className="min-w-full table-auto">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left font-semibold text-gray-600">
                      Product
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left font-semibold text-gray-600">
                      Quantity
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left font-semibold text-gray-600">
                      Price
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product._id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            className="w-[75px] object-contain rounded-md shadow"
                            src={product.images[0]}
                            alt={product.title}
                          />
                          <span className="text-gray-700">{product.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 flex items-center space-x-2">
                        <ChevronLeft
                          className="cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={() => lessOfThisProduct(product._id)}
                        />
                        <span className="text-gray-700 font-medium">
                          {
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                        </span>
                        <ChevronRight
                          className="cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={() => moreOfThisProduct(product._id)}
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-gray-800">
                        ₹{" "}
                        {(
                          cartProducts.filter((id) => id === product._id)
                            .length * product.price
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-gray-100">
                    <TableCell className="px-6 py-3 text-left font-semibold text-gray-700">
                      Total
                    </TableCell>
                    <TableCell className="px-6 py-3 text-left font-semibold text-gray-700">
                      {cartProducts.length}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-left font-semibold text-gray-700">
                      ₹{" "}
                      {products
                        .reduce(
                          (total, product) =>
                            total +
                            cartProducts.filter((id) => id === product._id)
                              .length *
                              product.price,
                          0
                        )
                        .toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            {/* Order Information */}
            {!!cartProducts?.length && (
              <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Billing Details
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    name="name"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Email"
                    value={email}
                    name="email"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="City"
                    value={city}
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Postal Code"
                    value={pCode}
                    name="pCode"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setpCode(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Street Address"
                    value={address}
                    name="address"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Country"
                    value={country}
                    name="country"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    name="phone"
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Button
                  black
                  block
                  onClick={goToPayment}
                  className="mt-6 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Continue to Payment
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session: session,
    },
  };
}
