import axiosInstance from "./axios-interceptor";

/**
 * Shared fetcher for SWR using the existing axios instance.
 * Handles both BFF ({ success, data, error, meta }) and service ({ orders: [], meta: {} }) shapes.
 * Throws errors for SWR to catch.
 */
export const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);
  const data = response.data;

  // BFF shape: { success, data, error, meta }
  if (typeof data === "object" && data !== null && "success" in data) {
    if (!data.success) {
      // If error shape, throw for SWR
      throw data.error || new Error("Unknown error");
    }
    return data;
  }

  // Service shape: { orders: [], meta: {} } or similar
  return data;
};
