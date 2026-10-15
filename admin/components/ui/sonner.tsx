import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

/**
 * Renders the `sonner` toast viewport using the active next-themes theme.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. All `sonner` `ToasterProps` are forwarded, and the CSS variables are wired to the admin theme tokens.
 *
 * @example
 * ```tsx
 * // Mounted once in _app.tsx; trigger notifications with `toast()` from "sonner".
 * <Toaster position="top-right" />
 * ```
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
