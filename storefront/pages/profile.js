"use client";

import { motion } from "framer-motion";

import { ShoppingBag, Heart, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
    }
  }, []);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <section className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar
              className="w-24 h-24 mb-4"
              src={user?.user?.avatar || "/profile-pic.jpg"}
              alt="User Avatar"
            />
            <h1 className="text-2xl font-semibold">
              {user?.user?.name || "Online Shopper"}
            </h1>
            <p className="text-gray-500">
              {user?.user?.email || "No email provided"}
            </p>
          </motion.div>

          <div className="mt-4 flex space-x-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-5 h-5 mr-2" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent
                aria-labelledby="edit-profile-title"
                aria-describedby="edit-profile-description"
              >
                <DialogHeader>
                  <DialogTitle id="edit-profile-title">
                    Edit Profile
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription id="edit-profile-description">
                  Make changes to your account here. Click save when you're
                  done.
                </DialogDescription>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="abc@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Logic to save user information
                      console.log("Save user information");
                      setOpen(false);
                    }}
                    className="bg-green-500"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Order History Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <motion.ul
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <li className="bg-white shadow-sm rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Order #12345</p>
                <p className="text-gray-500">3 Items - $120.00</p>
              </div>
              <Button variant="ghost">
                <ShoppingBag className="w-5 h-5 mr-2" /> View Details
              </Button>
            </li>
          </motion.ul>
        </section>

        {/* Wishlist Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
          <motion.ul
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <li className="bg-white shadow-sm rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Nike Air Max</p>
                <p className="text-gray-500">$150.00</p>
              </div>
              <Button variant="ghost">
                <Heart className="w-5 h-5 mr-2 text-red-500" /> Remove
              </Button>
            </li>
          </motion.ul>
        </section>
      </main>
    </>
  );
}
