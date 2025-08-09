// src/utils/axiosInstance.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // enables cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});
