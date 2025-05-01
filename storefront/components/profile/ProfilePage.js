"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Heart, Settings, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ProfileImageUploader } from "@/components/profile/ProfileImageUploader";
import { AddressForm } from "@/components/profile/AddressForm";
import { ProfileEditDialog } from "@/components/profile/ProfileEditDialog";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { WishlistSection } from "@/components/profile/WishlistSection";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState < any > null;
  const [profileOpen, setProfileOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
    }
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    const updatedUser = {
      ...user,
      user: {
        ...user?.user,
        ...updatedProfile,
      },
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setProfileOpen(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleAddressUpdate = (address) => {
    const updatedUser = {
      ...user,
      user: {
        ...user?.user,
        address,
      },
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setAddressOpen(false);
  };

  const handleImageChange = (imageUrl) => {
    const updatedUser = {
      ...user,
      user: {
        ...user?.user,
        avatar: imageUrl,
      },
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast({
      title: "Profile Image Updated",
      description: "Your profile picture has been updated successfully.",
    });
  };

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-800/50 shadow-xl rounded-2xl p-8 border border-white/10"
        >
          <div className="flex flex-col items-center text-center">
            <ProfileImageUploader
              currentImage={user?.user?.avatar}
              onImageChange={handleImageChange}
            />
            <div className="mt-4 space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {user?.user?.name || "Online Shopper"}
              </h1>
              <p className="text-gray-400">
                {user?.user?.email || "No email provided"}
              </p>
              {user?.user?.phone && (
                <p className="text-gray-400">{user.user.phone}</p>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <ProfileEditDialog
                open={profileOpen}
                onOpenChange={setProfileOpen}
                initialData={user?.user}
                onSave={handleProfileUpdate}
              />

              <Button
                variant="outline"
                className="border-purple-500/50"
                onClick={() => setAddressOpen(true)}
              >
                <MapPin className="w-4 h-4 mr-2" /> Update Address
              </Button>
            </div>
          </div>

          {user?.user?.address && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-4 bg-neutral-700/20 rounded-lg border border-white/5"
            >
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Address
              </h3>
              <p className="text-gray-400">
                {user.user.address.street}, {user.user.address.city},{" "}
                {user.user.address.state} {user.user.address.zipCode},{" "}
                {user.user.address.country}
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Orders & Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <OrderHistory />
          <WishlistSection />
        </div>
      </main>
    </>
  );
}
