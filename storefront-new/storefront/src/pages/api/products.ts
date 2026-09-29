// Compatibility alias. New storefront code should use /api/user/products/*
// through the shared API_ROUTES map instead of this legacy path.
export { default } from "./user/products/[[...path]]";
