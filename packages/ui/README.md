# 🎨 @ecommerce/ui

Shared UI component library, design system tokens, and UX patterns for the ShopSwift frontend ecosystem. Built on **React 19**, **Radix UI Primitives**, and **Tailwind CSS**.

---

## 📋 Component Library Overview

### 🧱 Primitives (`src/primitives/`)
Radix-based primitives wrapped with ShopSwift styling:
- **Buttons & Controls**: `Button` (`buttonVariants`), `Checkbox`, `Switch`, `Input`, `Textarea`, `Label`, `Select` (+ `SelectGroup`, `SelectItem`, ...)
- **Overlays & Dialogs**: `Dialog` (+ `DialogContent`, `DialogHeader`, ...), `Popover`, `Tooltip` (`TooltipProvider`)
- **Layout & Feedback**: `Card` (+ `CardHeader`, `CardTitle`, `CardAction`, ...), `Tabs`, `Separator`, `Badge` (`badgeVariants`), `Avatar`, `Progress`, `Skeleton`

### 🧩 Patterns (`src/patterns/`)
- **`DataTable`**: Generic table driven by `Column<T>` definitions.
- **`MetricDisplay`**: KPI card with trend indicator.
- **`PriceDisplay`**: Currency display (also exports `formatCurrency`).
- **`FormField`**: Form field wrapper with label and error text.
- **`PageHeader`**: Title and action container.
- **`LoadingState`**, **`LoadingSpinner`**, **`ErrorState`**, **`EmptyState`**: Standard state displays.

### 🔧 Utilities (`src/lib/`)
- `cn`: Tailwind class merge helper (`clsx` + `tailwind-merge`).

### 🎨 Theme (`src/theme/`)
Design tokens (`tokens.css`) ensuring brand visual consistency across Storefront and Admin applications.

---

## 🚀 Usage

```typescript
import { 
  Button, 
  Dialog, 
  Card, 
  DataTable, 
  MetricDisplay, 
  PriceDisplay 
} from '@ecommerce/ui';
```

---

## 🛠️ Building & Type-Checking

From the monorepo root:

```bash
# Type check UI package
npx tsc --noEmit -p packages/ui
```
