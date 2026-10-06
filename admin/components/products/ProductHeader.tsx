import { motion } from "framer-motion";
import { Plus, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductsHeaderProps {
  productsCount: number;
}

const ProductsHeader = ({ productsCount }: ProductsHeaderProps) => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-b border-zinc-800/50 bg-gradient-to-r from-zinc-950/90 via-zinc-900/90 to-zinc-950/90 backdrop-blur-xl sticky top-0 z-10 shadow-xl"
    >
      <div className="h-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Manage your product inventory • {productsCount} products
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {productsCount}
              </div>
              <div className="text-xs text-zinc-400">Total</div>
            </div>
            {/* <div className="w-px h-8 bg-zinc-700"></div>
            <div className="text-center">
              <div className="text-lg font-semibold text-emerald-400">86%</div>
              <div className="text-xs text-zinc-400">In Stock</div>
            </div> */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300"
            >
              <Upload size={16} />
              Import
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300"
            >
              <Download size={16} />
              Export
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="sm"
              className="gap-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/products/add-product">
                <Plus size={16} />
                Create Product
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default ProductsHeader;
