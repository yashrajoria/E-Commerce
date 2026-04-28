import {
  getUserData as sharedGetUserData,
  // updateUserData not present in shared API; keep a thin wrapper using axios if needed
  updateUserData as sharedUpdateUserData,
  // updatePassword is not exposed as the same name in shared; use shared API if available
  // For parity, map to shared endpoint names where appropriate
} from "@ecommerce/shared";

export const getUserData = async () => sharedGetUserData();

export const updateUserData = async (data: Record<string, unknown>) => {
  if (typeof sharedUpdateUserData === "function") {
    return sharedUpdateUserData(data);
  }
  // Fallback: call the app's existing axios instance to update profile
  const { axiosInstance } = await import("@/utils/axiosInstance");
  const { API_ROUTES } = await import("../pages/api/constants/apiRoutes");
  const response = await axiosInstance.put(API_ROUTES.USER.UPDATE_USER_DATA, data);
  return response.data;
};

export const updatePassword = async (oldPassword: string, newPassword: string) => {
  // Try to call shared API if available
  try {
    const shared = await import("@ecommerce/shared");
    if (typeof shared.updatePassword === "function") {
      return await shared.updatePassword(oldPassword, newPassword);
    }
  } catch {
    // ignore
  }

  // Fallback to local axios
  const { axiosInstance } = await import("@/utils/axiosInstance");
  const { API_ROUTES } = await import("../pages/api/constants/apiRoutes");
  const response = await axiosInstance.post(API_ROUTES.USER.UPDATE_PASSWORD, {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response.data;
};

export const logoutUser = async () => {
  try {
    const shared = await import("@ecommerce/shared");
    if (typeof shared.logout === "function") {
      return await shared.logout();
    }
  } catch {
    // ignore
  }
  const { axiosInstance } = await import("@/utils/axiosInstance");
  const { API_ROUTES } = await import("../pages/api/constants/apiRoutes");
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  return response.data;
};

export const checkAuthStatus = async () => {
  try {
    const shared = await import("@ecommerce/shared");
    if (typeof shared.checkStatus === "function") {
      return await shared.checkStatus();
    }
  } catch {
    // ignore
  }
  const { axiosInstance } = await import("@/utils/axiosInstance");
  const { API_ROUTES } = await import("../pages/api/constants/apiRoutes");
  try {
    const response = await axiosInstance.get(API_ROUTES.AUTH.STATUS);
    return response.data;
  } catch {
    return { authenticated: false };
  }
};
