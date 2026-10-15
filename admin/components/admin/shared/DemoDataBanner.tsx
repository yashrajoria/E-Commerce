/** Props accepted by {@link DemoDataBanner}. */
interface DemoDataBannerProps {
  /** Human-readable name of the feature whose placeholder values are on display. */
  feature: string;
}

/**
 * Renders an amber status banner warning that a feature still serves demo data.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <DemoDataBanner feature="Customer reviews" />
 * ```
 */
export function DemoDataBanner({ feature }: DemoDataBannerProps) {
  return (
    <div
      role="status"
      className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
    >
      <strong className="font-semibold">Demo data</strong>
      {" — "}
      {feature} is not connected to live APIs yet. Values below are
      placeholders.
    </div>
  );
}
