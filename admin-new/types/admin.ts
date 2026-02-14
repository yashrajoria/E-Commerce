export type AdminRole = "super_admin" | "admin" | "editor";

export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  twoFactorEnabled: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  theme: "light" | "dark" | "system";
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileUpdate
  extends Partial<Omit<AdminProfile, "_id" | "createdAt" | "updatedAt">> {
  currentPassword?: string;
  newPassword?: string;
}
