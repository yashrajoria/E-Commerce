/**
 * Icon Showcase Component
 * Visual display of all available brand icons
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  AdminIcon,
  StorefrontIcon,
  LogoIcon,
  ProductIcon,
  CategoryIcon,
  OrdersIcon,
  CustomersIcon,
  AnalyticsIcon,
  SettingsIcon,
  CartIcon,
  WishlistIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
} from "@ecommerce/shared";
  CheckIcon,
} from '@ecommerce/shared/src/components/icons';

interface IconShowcaseProps {
  size?: number;
  showNames?: boolean;
}

const iconList = [
  { name: 'Admin', icon: AdminIcon, color: 'text-purple-500' },
  { name: 'Storefront', icon: StorefrontIcon, color: 'text-yellow-500' },
  { name: 'Logo', icon: LogoIcon, color: 'text-purple-600' },
  { name: 'Product', icon: ProductIcon, color: 'text-blue-500' },
  { name: 'Category', icon: CategoryIcon, color: 'text-indigo-500' },
  { name: 'Orders', icon: OrdersIcon, color: 'text-green-500' },
  { name: 'Customers', icon: CustomersIcon, color: 'text-pink-500' },
  { name: 'Analytics', icon: AnalyticsIcon, color: 'text-orange-500' },
  { name: 'Settings', icon: SettingsIcon, color: 'text-gray-500' },
  { name: 'Cart', icon: CartIcon, color: 'text-yellow-600' },
  { name: 'Wishlist', icon: WishlistIcon, color: 'text-red-500' },
  { name: 'Search', icon: SearchIcon, color: 'text-cyan-500' },
  { name: 'Menu', icon: MenuIcon, color: 'text-gray-400' },
  { name: 'Close', icon: CloseIcon, color: 'text-red-400' },
  { name: 'Chevron Right', icon: ChevronRightIcon, color: 'text-gray-600' },
  { name: 'Check', icon: CheckIcon, color: 'text-emerald-500' },
];

export function IconShowcase({
  size = 32,
  showNames = true,
}: IconShowcaseProps) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Brand Icon System</h1>
      <p className="text-muted-foreground mb-8">
        Comprehensive set of custom icons for the E-Commerce application
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {iconList.map(({ name, icon: IconComponent, color }) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-4 rounded-lg glass-effect border border-white/10 hover:border-white/20 cursor-pointer transition-all"
          >
            <IconComponent size={size} className={`${color} mb-2`} />
            {showNames && (
              <span className="text-xs font-medium text-center text-muted-foreground">
                {name}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Usage Example */}
      <div className="mt-12 p-6 rounded-lg glass-effect border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
        <pre className="text-sm text-muted-foreground overflow-x-auto">
{`import {
  AdminIcon,
  ProductIcon,
  OrdersIcon,
} from '@ecommerce/shared/src/components/icons';

export function Dashboard() {
  return (
    <div className="flex gap-4">
      <AdminIcon size={24} className="text-purple-500" />
      <ProductIcon size={24} className="text-blue-500" />
      <OrdersIcon size={24} className="text-green-500" />
    </div>
  );
}`}
        </pre>
      </div>

      {/* Icon Sizes */}
      <div className="mt-8 p-6 rounded-lg glass-effect border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Available Sizes</h2>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <AdminIcon size={16} className="text-purple-500 mb-2" />
            <span className="text-xs text-muted-foreground">size={`16`}</span>
          </div>
          <div className="flex flex-col items-center">
            <AdminIcon size={24} className="text-purple-500 mb-2" />
            <span className="text-xs text-muted-foreground">size={`24`} (default)</span>
          </div>
          <div className="flex flex-col items-center">
            <AdminIcon size={32} className="text-purple-500 mb-2" />
            <span className="text-xs text-muted-foreground">size={`32`}</span>
          </div>
          <div className="flex flex-col items-center">
            <AdminIcon size={48} className="text-purple-500 mb-2" />
            <span className="text-xs text-muted-foreground">size={`48`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IconShowcase;
