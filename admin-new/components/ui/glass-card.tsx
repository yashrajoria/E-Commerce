/**
 * GlassCard – Premium glassmorphism card with optional gradient border
 * Supports hover glow, animated border, and multiple intensity levels
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  /** Glassmorphism intensity */
  intensity?: "subtle" | "medium" | "strong";
  /** Enable gradient border effect */
  gradientBorder?: boolean;
  /** Enable hover glow effect */
  hoverGlow?: boolean;
  /** Glow color variant */
  glowColor?: "purple" | "emerald" | "gold" | "blue";
  /** Enable hover lift animation */
  hoverLift?: boolean;
}

const glowMap = {
  purple: "hover:shadow-[0_0_30px_hsla(263,70%,58%,0.15)]",
  emerald: "hover:shadow-[0_0_30px_hsla(160,84%,39%,0.15)]",
  gold: "hover:shadow-[0_0_30px_hsla(43,96%,56%,0.15)]",
  blue: "hover:shadow-[0_0_30px_hsla(217,91%,60%,0.15)]",
};

const intensityMap = {
  subtle: "glass-effect",
  medium: "glass-effect",
  strong: "glass-effect-strong",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      intensity = "medium",
      gradientBorder = false,
      hoverGlow = false,
      glowColor = "purple",
      hoverLift = true,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl overflow-hidden",
          intensityMap[intensity],
          gradientBorder && "border-gradient",
          hoverGlow && glowMap[glowColor],
          hoverLift && "card-hover",
          "transition-all duration-300",
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

GlassCard.displayName = "GlassCard";
