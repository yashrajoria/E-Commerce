/**
 * Minimal ambient type declaration for the optional `canvas-confetti`
 * dependency used on the payment success page.
 *
 * @remarks
 * Prevents TS7016 when importing the module without `@types/canvas-confetti`
 * installed; replace with a fuller type file or the official package when
 * available.
 */
declare module "canvas-confetti" {
  /**
   * Options accepted by the {@link confetti} launcher.
   */
  export type ConfettiOptions = {
    /** Number of confetti particles to emit per burst. */
    particleCount?: number;
    /** Spread angle of the burst, in degrees. */
    spread?: number;
    /** Normalized origin of the burst (0–1 on each axis). */
    origin?: { x?: number; y?: number };
    /** Any additional passthrough option from the underlying library. */
    [key: string]: unknown;
  };

  /**
   * Launches a confetti burst in the browser.
   *
   * @param opts - Optional burst configuration.
   * @returns Nothing; this ambient signature declares no return value.
   */
  function confetti(opts?: ConfettiOptions): void;

  export default confetti;
}
