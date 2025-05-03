import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Bell, Upload } from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  notifications: z.enum(["enabled", "disabled"]),
});

export default function ProfilePage() {
  const [avatarPreview, setAvatarPreview] = useState(
    "https://github.com/shadcn.png"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "admin@yourstore.com",
      password: "",
      notifications: "enabled",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // TODO: Handle form submit to backend
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.h1
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Profile Settings
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 rounded-full">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              <Upload size={16} />
              <span>Change Avatar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 mb-1 text-sm font-medium">
              <Mail size={16} />
              Email
            </label>
            <Input
              {...register("email")}
              className="bg-gray-900 text-white border-gray-700"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 mb-1 text-sm font-medium">
              <Lock size={16} />
              Password
            </label>
            <Input
              type="password"
              {...register("password")}
              className="bg-gray-900 text-white border-gray-700"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Notifications */}
          <div>
            <label className="flex items-center gap-2 mb-1 text-sm font-medium">
              <Bell size={16} />
              Notifications
            </label>
            <select
              {...register("notifications")}
              className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 w-full"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            {errors.notifications && (
              <p className="text-red-400 text-sm mt-1">
                {errors.notifications.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition"
          >
            Save Changes
          </Button>
        </form>
      </main>
    </div>
  );
}
