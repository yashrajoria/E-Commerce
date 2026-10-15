import { axiosInstance } from "@ecommerce/shared";

/**
 * SWR fetcher backed by the shared axios instance.
 *
 * @remarks
 * Handles both the BFF envelope (`{ success, data, error, meta }`) and raw
 * service shapes such as `{ orders: [], meta: {} }`.
 *
 * @param url - Endpoint to `GET`, usually a BFF path like `/bff/admin/orders`.
 * @returns The full BFF envelope when the response carries a `success` flag,
 * otherwise the response body as-is.
 * @throws The BFF `error` payload (or a generic `Error`) when `success` is false,
 * so SWR surfaces it as the hook's `error`.
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
