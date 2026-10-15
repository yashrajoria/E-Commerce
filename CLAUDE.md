# CLAUDE.md — ShopSwift Frontend Monorepo (`E-Commerce`)

This document contains key instructions, coding guidelines, and directory mappings for Claude and Claude Code working in the `E-Commerce/` frontend workspace.

---

## 1. Monorepo Overview

- **Stack**: Next.js 14/15, React 18, TypeScript, Tailwind CSS, SWR, Lucide React, Radix UI.
- **Packages**:
  - `storefront/` (:3000): Customer shopping experience, cart, checkout, customer profile.
  - `admin/` (:3001): Merchant operations, inventory management, AI Merchant Studio modal (`AIMerchantStudioModal.tsx`), analytics.
  - `packages/shared/`: Shared TypeScript models and API client contracts.
  - `packages/ui/`: Shared UI component primitives.
- **Gateway URL**: All backend communication routes through the API Gateway (`http://localhost:8080`).

---

## 2. Sub-Agents & Orchestrator

Refer to [../ORCHESTRATOR.md](../ORCHESTRATOR.md) and [.github/agents/](.github/agents/) for:
- `@storefront`: Customer store UI, catalog, checkout.
- `@admin`: Merchant dashboard and AI Studio modal.
- `@web-performance`: Core Web Vitals (LCP, CLS, INP) and bundle tuning.
- `@api-contract-guardian`: Syncing TypeScript contracts with Go/Python DTOs.
- `@e2e-qa-playwright`: Playwright browser test journeys.

---

## 3. Developer Commands

```bash
# Install dependencies across all workspaces
npm install

# Type check all packages
npm run type-check

# Run admin unit tests
cd admin && npx vitest run

# Run storefront unit tests
cd storefront && npm test

# Linting
npm run lint
```

---

## 4. Engineering Rules
- **No Direct Service Calls**: Always connect through API Gateway (`NEXT_PUBLIC_API_URL` -> `:8080`) or `/bff/admin/*`.
- **Component Patterns**: Use Tailwind CSS and Radix UI primitives. Avoid raw CSS or inline style tags.
- **TypeScript Strictness**: Keep types strict; avoid untyped `any`.
- **Documentation**: Update the owning app's `README.md` when introducing new routes or components.
