// import { CartContext } from "@/components/CartContext";
// import Navbar from "@/components/Navbar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import { CircleMinus, CirclePlus, Trash2 } from "lucide-react";
// import { getSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import { useContext, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// function Cart({ session }) {
//   const router = useRouter();
//   const { cartProducts, addProduct, removeProduct, clearCart, deleteProduct } =
//     useContext(CartContext);
//   const [products, setProducts] = useState([]);
//   const [flipped, setFlipped] = useState(false);

//   const [isSuccess, setIsSuccess] = useState(false);
//   const showAddress = () => {
//     alert("CLicked");
//   };
//   useEffect(() => {
//     if (cartProducts.length > 0) {
//       axios
//         .post("/api/cart", { ids: cartProducts })
//         .then((response) => setProducts(response.data));
//     } else {
//       setProducts([]);
//     }
//   }, [cartProducts]);

//   useEffect(() => {
//     if (window.location.href.includes("success")) {
//       clearCart();
//       localStorage.removeItem("cart");
//       setIsSuccess(true);
//     }
//   }, []);

//   const totalQuantity = cartProducts.length;
//   const totalPrice = products.reduce(
//     (total, product) =>
//       total +
//       cartProducts.filter((id) => id === product._id).length * product.price,
//     0
//   );

//   if (isSuccess) {
//     return (
//       <>
//         <Navbar />
//         <div className="flex justify-center items-center h-screen">
//           <Card className="w-full max-w-md  text-white">
//             <CardHeader>
//               <CardTitle className="text-center text-green-400">
//                 Thank You for Your Payment!
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-center">Your order has been confirmed.</p>
//               <p className="text-center text-sm text-gray-400">
//                 A confirmation email has been sent.
//               </p>
//               <Button
//                 className="w-full mt-4 bg-green-600 text-white hover:bg-green-700"
//                 href="/my-orders"
//               >
//                 View Orders
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <header>
//         <Navbar />
//       </header>

//       <main className="container mx-auto p-6">
//         {/* Title */}
//         <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
//           🛒 Your Shopping Cart
//         </h1>

//         <div
//           initial={false}
//           animate={{ rotateY: flipped ? 180 : 0 }}
//           transition={{ duration: 0.6 }}
//           onClick={() => setFlipped(!flipped)}
//           className="grid grid-cols-1 md:grid-cols-3 gap-6"
//         >
//           {/* Cart Items Section */}
//           <section className="md:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex justify-between items-center">
//                   Your Items
//                   {cartProducts.length > 0 && (
//                     <Button onClick={clearCart} variant="destructive">
//                       Clear Cart
//                     </Button>
//                   )}
//                 </CardTitle>
//               </CardHeader>

//               <CardContent>
//                 {cartProducts.length === 0 ? (
//                   <p className="text-center text-lg font-medium text-gray-400">
//                     Your cart is empty 😔
//                   </p>
//                 ) : (
//                   <ul className="space-y-4">
//                     {products.map((product) => (
//                       <li key={product._id}>
//                         <Card className="flex items-center gap-4 p-4">
//                           <img
//                             src={product.images[0]}
//                             alt={product.title}
//                             className="w-20 h-20 rounded-md shadow object-contain"
//                           />
//                           <h2 className="flex-1 font-medium text-gray-900">
//                             {product.title}
//                           </h2>
//                           <div className="flex items-center gap-2">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => removeProduct(product._id)}
//                             >
//                               <CircleMinus className="text-gray-500 hover:text-gray-700" />
//                             </Button>
//                             <span className="font-medium text-gray-800">
//                               {
//                                 cartProducts.filter((id) => id === product._id)
//                                   .length
//                               }
//                             </span>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => addProduct(product._id)}
//                             >
//                               <CirclePlus className="text-gray-500 hover:text-gray-700" />
//                             </Button>
//                           </div>
//                           <p className="text-gray-700 text-lg font-semibold">
//                             ₹{product.price.toFixed(2)}
//                           </p>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => deleteProduct(product._id)}
//                           >
//                             <Trash2 className="text-red-500 hover:text-red-700" />
//                           </Button>
//                         </Card>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Total Summary */}
//             {cartProducts.length > 0 && (
//               <Card className="mt-6">
//                 <CardContent className="flex justify-between font-semibold text-lg p-4">
//                   <span>Total Items: {totalQuantity}</span>
//                   <span>Total Price: ₹{totalPrice.toFixed(2)}</span>
//                 </CardContent>
//               </Card>
//             )}
//           </section>

//           {/* Promo Code & Summary */}
//           <aside>
//             <Card>
//               <CardHeader>
//                 <CardTitle>🎟 Apply Promo Code</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center gap-2">
//                   <Input placeholder="Enter code" />
//                   <Button className="bg-black text-white hover:bg-gray-900">
//                     Apply
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Order Summary */}
//             <Card className="mt-6">
//               <CardHeader>
//                 <CardTitle>🧾 Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2 text-gray-700">
//                   <li className="flex justify-between">
//                     <span>Subtotal:</span> <span>₹{totalPrice.toFixed(2)}</span>
//                   </li>
//                   <li className="flex justify-between text-green-600">
//                     <span>Discount:</span> <span>- ₹0.00</span>
//                   </li>
//                   <li className="flex justify-between text-xl font-bold border-t pt-2">
//                     <span>Total:</span> <span>₹{totalPrice.toFixed(2)}</span>
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>
//             <Button onClick={showAddress} className="w-full mt-4">
//               Checkout
//             </Button>
//           </aside>
//         </div>
//       </main>
//     </>
//   );
// }

// export default Cart;

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   return {
//     props: {
//       session: session,
//     },
//   };
// }

import { CartContext } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CartItem } from "@/components/cart/CartItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
import { getSession } from "next-auth/react";

export default function Cart({ session }) {
  const router = useRouter();
  const { cartProducts, addProduct, removeProduct, clearCart, deleteProduct } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const showAddress = () => {
    alert("CLicked");
  };

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios
        .post("/api/cart", { ids: cartProducts })
        .then((response) => setProducts(response.data));
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (window.location.href.includes("success")) {
      clearCart();
      localStorage.removeItem("cart");
      setIsSuccess(true);
      // toast.success("Payment successful! Thank you for your order.");
    }
  }, []);

  const totalQuantity = cartProducts.length;
  const totalPrice = products.reduce(
    (total, product) =>
      total +
      cartProducts.filter((id) => id === product._id).length * product.price,
    0
  );

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <motion.div
          className="flex justify-center items-center min-h-[80vh]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md bg-neutral-800/50 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-center text-green-400 text-2xl">
                Thank You for Your Purchase! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-white/80">
                Your order has been confirmed.
              </p>
              <p className="text-center text-sm text-white/60">
                A confirmation email has been sent to your inbox.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90"
                onClick={() => router.push("/my-orders")}
              >
                View My Orders
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-shop-dark text-white">
      <Navbar />

      <main className="container mx-auto p-6 pt-24">
        <motion.h1
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-shop-purple to-shop-blue bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2">
            <Card className="bg-neutral-800/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-white/90">
                  Your Items
                  {cartProducts.length > 0 && (
                    <Button
                      onClick={clearCart}
                      variant="destructive"
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                    >
                      Clear Cart
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {cartProducts.length === 0 ? (
                  <motion.p
                    className="text-center text-lg font-medium text-white/60 py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Your cart is empty 🛒
                  </motion.p>
                ) : (
                  <AnimatePresence>
                    <ul className="space-y-4">
                      {products.map((product) => (
                        <CartItem
                          key={product._id}
                          product={product}
                          quantity={
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                          onAdd={addProduct}
                          onRemove={removeProduct}
                          onDelete={deleteProduct}
                        />
                      ))}
                    </ul>
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>

            {cartProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mt-6 bg-neutral-800/50 border-white/10">
                  <CardContent className="flex justify-between font-semibold text-lg p-4 text-white/90">
                    <span>Total Items: {totalQuantity}</span>
                    <span>Total Price: ₹{totalPrice.toFixed(2)}</span>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </section>

          <aside>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-neutral-800/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white/90">🎟 Promo Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter code"
                      className="bg-neutral-700/50 border-white/10 text-white placeholder:text-white/50"
                    />
                    <Button className="bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <OrderSummary totalPrice={totalPrice} />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  showAddress();
                  // toast.info("Proceeding to checkout...");
                }}
                className="w-full mt-4 bg-gradient-to-r from-shop-purple to-shop-blue hover:opacity-90 font-semibold text-lg py-6"
              >
                Proceed to Checkout
              </Button>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session: session,
    },
  };
}
