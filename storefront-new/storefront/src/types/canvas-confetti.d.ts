// Minimal TypeScript declaration for `canvas-confetti` used in the project.
// This prevents `TS7016` when importing the module. Replace with a fuller
// type file if desired or install `@types/canvas-confetti` when available.
declare module "canvas-confetti" {
  const confetti: any;
  export default confetti;
}
