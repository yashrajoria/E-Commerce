# Add route guards for checkout & payment

## Summary
Prevent access to /checkout and /payment/* when the cart is empty or the user is unauthenticated.

## Tasks
- [ ] Add client/server guard to check CartContext and UserContext on page load
- [ ] Redirect unauthenticated users to login with return URL
- [ ] Redirect empty-cart users to /cart with user-friendly message/toast
- [ ] Add unit/integration tests for redirect behavior

## Files / places to check
- src/pages/checkout/*
- src/pages/payment/*
- src/context/CartContext.tsx
- src/context/UserContext.tsx

## Priority
priority/P0

## Estimate
estimate/M

## Acceptance criteria
- Reproducing: opening /checkout without cart or auth redirects appropriately
- Tests added and passing
