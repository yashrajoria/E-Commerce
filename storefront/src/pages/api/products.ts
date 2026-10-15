/**
 * Compatibility alias re-exporting legacy `/api/products` to the catch-all `/api/user/products/[[...path]]` handler.
 *
 * @remarks
 * New storefront code should use `/api/user/products/*` through the shared `API_ROUTES` map instead of this legacy path.
 */
export { default } from "./user/products/[[...path]]";
