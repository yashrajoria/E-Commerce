import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  Box,
  Users,
  ShoppingBag,
  BarChart,
  Settings,
} from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <motion.aside
      className="w-64 bg-gray-800 text-white h-full p-4"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Logo */}
      <div className="text-center mb-8 text-2xl font-bold">
        <span>Admin Panel</span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4">
        <ul>
          {/* Dashboard */}
          <li className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer">
            <Home size={20} />
            <span>Dashboard</span>
          </li>

          {/* Products Management */}
          <li className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer">
            <Box size={20} />
            <Link href="/products" className="flex items-center space-x-2">
              <span>Products</span>
            </Link>
          </li>

          {/* Orders Management */}
          <li className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer">
            <ShoppingBag size={20} />
            <span>Orders</span>
          </li>

          {/* Customers */}
          <li className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer">
            <Users size={20} />
            <span>Customers</span>
          </li>

          {/* Analytics */}
          <li className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer">
            <BarChart size={20} />
            <span>Analytics</span>
          </li>

          {/* Settings */}
          <li className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer">
            <Settings size={20} />
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
