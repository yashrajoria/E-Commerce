import { axiosInstance } from "@/utils/axiosInstance";
import { API_ROUTES } from "./constants/apiRoutes";

export const loginUser = async (email: string, password: string) => {
  console.log(email, password);
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, {
    email,
    password,
    role: "user",
  });
  return response.data;
};
export const registerUser = async (
  email: string,
  password: string,
  fullName: string
) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.REGISTER, {
    email,
    password,
    name: fullName,
    role: "user",
  });
  return response.data;
};

export const verifyEmail = async (email: string, code: string) => {
  console.log(email, code);
  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.VERIFY_EMAIL, {
      email,
      code,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
