import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Props accepted by {@link ThemeToggle}. */
interface ThemeToggleProps {
  /** Additional classes merged onto the trigger button. */
  className?: string;
  /**
   * Size variant forwarded to the underlying `Button`.
   *
   * @defaultValue "icon"
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Renders an icon button that switches the admin app between light and dark themes.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * // Rendered in the admin header, next to the page title.
 * <ThemeToggle className="ml-auto" />
 * ```
 */
export function ThemeToggle({ className, size = "icon" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={`h-9 w-9 rounded-lg text-muted-foreground ${className || ""}`}
        aria-label="Toggle theme"
        disabled
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`h-9 w-9 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer ${
              className || ""
            }`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-transform duration-200 -rotate-12 hover:rotate-0" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span>{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ThemeToggle;
