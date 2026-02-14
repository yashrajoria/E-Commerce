"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, HelpCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const actions = [
    { icon: ShoppingBag, label: "Cart", badge: totalItems || undefined },
    { icon: HelpCircle, label: "Help" },
    { icon: Tag, label: "Offers" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <button className="w-12 h-12 rounded-full shadow-lg relative bg-background/90 backdrop-blur-sm border border-border/60 flex items-center justify-center hover:bg-muted transition-colors">
                  <action.icon className="h-5 w-5" />
                  {action.badge ? (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                      {action.badge}
                    </Badge>
                  ) : null}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <button
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 flex items-center justify-center text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
        </button>
      </motion.div>
    </div>
  );
}
