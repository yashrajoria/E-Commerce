/**
 * Premium Loading Spinner with gradient animation
 */
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { spinner: 24, text: "text-xs" },
  md: { spinner: 36, text: "text-sm" },
  lg: { spinner: 48, text: "text-base" },
};

const LoadingSpinner = ({
  message = "Loading...",
  size = "md",
}: LoadingSpinnerProps) => {
  const { spinner, text } = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 gap-4"
    >
      <div className="relative" style={{ width: spinner, height: spinner }}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "hsl(var(--primary))",
            borderRightColor: "hsl(var(--primary) / 0.3)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute rounded-full border-2 border-transparent"
          style={{
            inset: 4,
            borderBottomColor: "hsl(var(--accent))",
            borderLeftColor: "hsl(var(--accent) / 0.3)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        {/* Center dot */}
        <div
          className="absolute rounded-full bg-primary animate-pulse"
          style={{
            width: 6,
            height: 6,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-muted-foreground ${text}`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
