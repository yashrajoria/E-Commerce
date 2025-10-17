import { axiosInstance } from "@/utils/axiosInstance";
import { API_ROUTES } from "../pages/api/constants/apiRoutes";

export const getUserData = async () => {
  const response = await axiosInstance.get(API_ROUTES.USER.PROFILE);
  return response.data;
};

export const updateUserData = async (data) => {
  const response = await axiosInstance.put(
    API_ROUTES.USER.UPDATE_USER_DATA,
    data
  );
  return response.data;
};

export const updatePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  console.log("Updating password:", oldPassword, newPassword);
  const response = await axiosInstance.post(API_ROUTES.USER.UPDATE_PASSWORD, {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  return response.data;
};
