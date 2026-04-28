# Add focus trap & ARIA to modals/drawers

## Summary
Improve accessibility for login-modal, cart-drawer, wishlist-drawer.

## Tasks
- [ ] Add focus-trap and restore focus on close
- [ ] Add role="dialog", aria-modal, aria-labelledby
- [ ] ESC key handling and backdrop click close
- [ ] Add accessibility tests (axe / jest-axe)

## Files / places to check
- src/components/common/login-modal.tsx
- src/components/common/cart-drawer.tsx
- src/components/common/wishlist-drawer.tsx

## Priority
priority/P1

## Estimate
estimate/S

## Acceptance criteria
- Keyboard navigation works; passes automated accessibility checks
