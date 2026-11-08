# 📦 @ecommerce/shared

Shared TypeScript models, API client, authentication utilities, auth hook/components, and small UI primitives for the ShopSwift frontend monorepo. Used by both the **Storefront** (`:3001`) and the **Admin Dashboard** (`:3000`).

---

## 📋 Contents

- **`src/api/`**:
  - `apiRoutes.ts`: `API_ROUTES` dictionary of API Gateway endpoints (groups: `AUTH`, `USER`, `PRODUCTS`, `CATEGORIES`, `ORDERS`, `STORE_CREDIT`, `CART`, `PAYMENT`, `PROMOTIONS`).
  - `auth.ts`: Auth helpers re-exported from the package root: `login`, `register`, `guestAuth`, `verifyEmail`, `resendVerificationEmail`, `requestPasswordReset`, `resetPassword`, `refreshTokens`, `logout`, `checkStatus`, `getUserData`, `updateUserData`, `updatePassword`, `validatePassword`.
- **`src/utils/`**:
  - `axiosInstance.ts`: Axios client (`withCredentials`, cookie sessions, refresh handling) plus `setAPIErrorHandler`, `setAuthRefreshUrl`, `setActiveStoreId`, `getActiveStoreId`.
  - `apiProxy.ts`: Next.js API-route helpers `getBackendBaseUrl`, `proxyRequest`, `sanitizeSetCookies`.
  - `index.ts`: `cn`, `formatCurrency`, `formatGBP`, `formatINR`, `formatDate`, `formatRelativeDate`, `trapFocus`, `resolveProductImageUrl`.
- **`src/types/`**:
  - `models.ts`: `Product`, `Category`, `Customer`, `Address`, `OrderStatus`, `OrderItem`, `Order`, `CartItem`, `Collection`, and multi-tenant types `Store`, `StoreRole`, `StoreMembership`, `StoreSettings`, `Plan`, `PlanEntitlement`, `StoreSubscription`.
  - `storeCredit.ts`: `StoreCreditEntryType` (`grant`, `debit`, `hold`, `capture`, `release`, `refund`), `StoreCreditLedgerEntry`, `StoreCreditBalance`, `StoreCreditReconcileReport`, `StoreCreditGrantRequest`, `StoreCreditAdjustRequest`.
  - `common.ts`: `ApiResponse`, `PaginatedResponse`, `SearchFilters`, `DashboardMetrics`, CSV/upload/form/async-state types, and others.
- **`src/hooks/useAuth.tsx`**: `AuthProvider` and `useAuth`.
- **`src/components/`**: `auth/` (`Login`, `Register`, `Logout`), `ui/` (`Button`, `Avatar`, `Badge`, `Card`, `InputOTP`, `Label`, `Pagination`, `Select`, `Tabs`), `icons/` (brand icons such as `LogoIcon`, `CartIcon`, plus an `icons` map).
- **`src/lib/`**: `config.ts` (app constants), `helpers.ts` (`parseCSV`, `debounce`, `throttle`, `retryWithBackoff`, ...) and `logger.ts`. These are not exported from the package root; import by path.

---

## 🚀 Usage

Import directly from `@ecommerce/shared` in any monorepo workspace:

```typescript
import { 
  API_ROUTES, 
  login, 
  guestAuth 
} from '@ecommerce/shared';
import type { 
  Product, 
  Order, 
  StoreCreditAccount, 
  StoreCreditLedgerEntry 
} from '@ecommerce/shared';
```

---

## 🛠️ Building & Type-Checking

From the monorepo root:

```bash
# Type check shared package
npx tsc --noEmit -p packages/shared
```
