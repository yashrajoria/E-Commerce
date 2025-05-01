import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// interface OrderSummaryProps {
//   totalPrice: number;
// }

export function OrderSummary({ totalPrice }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="mt-6 bg-neutral-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">🧾 Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-white/80">
            <li className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </li>
            <li className="flex justify-between text-green-400">
              <span>Discount:</span>
              <span>- ₹0.00</span>
            </li>
            <motion.li
              className="flex justify-between text-xl font-bold border-t border-white/10 pt-2"
              whileHover={{ scale: 1.02 }}
            >
              <span>Total:</span>
              <span className="text-shop-purple">₹{totalPrice.toFixed(2)}</span>
            </motion.li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
