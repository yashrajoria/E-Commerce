export function DemoDataBanner({ feature }: { feature: string }) {
  return (
    <div
      role="status"
      className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
    >
      <strong className="font-semibold">Demo data</strong>
      {" — "}
      {feature} is not connected to live APIs yet. Values below are placeholders.
    </div>
  );
}
