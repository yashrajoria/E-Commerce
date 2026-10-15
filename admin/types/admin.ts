/** Role granted to an admin account, from lowest (`editor`) to highest (`super_admin`) privilege. */
export type AdminRole = "super_admin" | "admin" | "editor";

/** Admin account profile returned by the admin profile endpoints. */
export interface AdminProfile {
  /** Mongo document id of the admin account. */
  _id: string;
  /** Display name shown in the admin shell. */
  name: string;
  /** Login email address. */
  email: string;
  /** Authorization role used for RBAC checks. */
  role: AdminRole;
  /** Optional avatar image URL. */
  avatar?: string;
  /** Optional contact phone number. */
  phone?: string;
  /** ISO timestamp of the last successful login. */
  lastLogin?: string;
  /** Whether two-factor authentication is enabled for the account. */
  twoFactorEnabled: boolean;
  /** Per-channel notification opt-ins for the account. */
  notificationPreferences: {
    /** Email notifications enabled. */
    email: boolean;
    /** Browser push notifications enabled. */
    push: boolean;
    /** Desktop notifications enabled. */
    desktop: boolean;
  };
  /** Preferred color theme; `"system"` follows the operating system. */
  theme: "light" | "dark" | "system";
  /** Fine-grained permission keys granted to the account. */
  permissions: string[];
  /** ISO timestamp of account creation. */
  createdAt: string;
  /** ISO timestamp of the last profile update. */
  updatedAt: string;
}

/** Partial profile payload for updating an admin account, with optional password rotation. */
export interface AdminProfileUpdate
  extends Partial<Omit<AdminProfile, "_id" | "createdAt" | "updatedAt">> {
  /** Current password, required by the API when setting a new password. */
  currentPassword?: string;
  /** Replacement password to set for the account. */
  newPassword?: string;
}
