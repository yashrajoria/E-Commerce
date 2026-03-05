// Minimal TypeScript declaration for `canvas-confetti` used in the project.
// This prevents `TS7016` when importing the module. Replace with a fuller
// type file if desired or install `@types/canvas-confetti` when available.
declare module "canvas-confetti" {
  export type ConfettiOptions = {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    [key: string]: unknown;
  };

  function confetti(opts?: ConfettiOptions): void;

  export default confetti;
}
