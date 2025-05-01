import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleMinus, CirclePlus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

// interface CartItemProps {
//   product: any;
//   quantity: number;
//   onAdd: (id: string) => void;
//   onRemove: (id: string) => void;
//   onDelete: (id: string) => void;
// }

export function CartItem({ product, quantity, onAdd, onRemove, onDelete }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex items-center gap-4 p-4 bg-neutral-800/50 border-white/10 hover:bg-neutral-800/80 transition-colors">
        <div className="relative w-20 h-20 group">
          <motion.img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full rounded-md shadow object-contain bg-neutral-700/50 p-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <h2 className="flex-1 font-medium text-white/90">{product.title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(product._id)}
            className="hover:bg-white/10"
          >
            <CircleMinus className="text-white/70 hover:text-white transition-colors" />
          </Button>
          <span className="font-medium text-white/90 min-w-[1.5rem] text-center">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAdd(product._id)}
            className="hover:bg-white/10"
          >
            <CirclePlus className="text-white/70 hover:text-white transition-colors" />
          </Button>
        </div>
        <p className="text-white/90 text-lg font-semibold min-w-[6rem] text-right">
          ₹{product.price.toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(product._id)}
          className="hover:bg-red-500/20"
        >
          <Trash2 className="text-red-400 hover:text-red-300 transition-colors" />
        </Button>
      </Card>
    </motion.li>
  );
}
