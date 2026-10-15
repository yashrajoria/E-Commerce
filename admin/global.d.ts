/**
 * Global TypeScript declarations for the admin app.
 *
 * @remarks
 * Ambient declarations only; no runtime code.
 */

/**
 * Treats CSS imports as modules exporting their class name map.
 *
 * @remarks
 * Used when a stylesheet is imported for its side effects in environments that
 * hand back a class-name map instead of a string.
 */
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
