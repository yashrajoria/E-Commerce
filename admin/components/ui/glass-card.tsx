/**
 * GlassCard – Premium glassmorphism card with optional gradient border
 * Supports hover glow, animated border, and multiple intensity levels
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

/** Props accepted by {@link GlassCard}; extends `framer-motion`'s div props. */
interface GlassCardProps extends HTMLMotionProps<"div"> {
  /**
   * Glassmorphism intensity.
   *
   * @defaultValue "medium"
   */
  intensity?: "subtle" | "medium" | "strong";
  /**
   * Enable gradient border effect.
   *
   * @defaultValue false
   */
  gradientBorder?: boolean;
  /**
   * Enable hover glow effect.
   *
   * @defaultValue false
   */
  hoverGlow?: boolean;
  /**
   * Glow color variant.
   *
   * @defaultValue "purple"
   */
  glowColor?: "purple" | "emerald" | "gold" | "blue";
  /**
   * Enable hover lift animation.
   *
   * @defaultValue true
   */
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

/**
 * Renders a frosted-glass panel with optional gradient border, hover glow and hover lift.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side `framer-motion` animation, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <GlassCard intensity="strong" hoverGlow glowColor="emerald">
 *   <p className="p-6">Revenue overview</p>
 * </GlassCard>
 * ```
 */
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
