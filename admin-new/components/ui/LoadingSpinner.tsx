import { motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="mb-4"
      >
        <Loader2Icon className="h-8 w-8 text-primary" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground"
      >
        Loading products...
      </motion.p>
    </motion.div>
  );
};

export default LoadingSpinner;
