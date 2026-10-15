import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { axiosInstance } from "@ecommerce/shared";
import type {
  StoreCreditBalance,
  StoreCreditLedgerEntry,
  StoreCreditReconcileReport,
} from "@/types/storeCredit";

/**
 * Subscribes to a customer's store-credit balance.
 *
 * @remarks
 * Backed by SWR at `/api/admin/store-credit/balance`, keyed on the user id; the
 * request is skipped until both `userId` and `storeId` are provided. The active
 * store is attached by the shared axios instance as the `X-Store-ID` header.
 *
 * @param userId - Identity-service id of the customer whose balance to load.
 * @param storeId - Active store id; required to enable the request (sent via the axios store header).
 * @returns The SWR response whose `data` is a `StoreCreditBalance` (or `undefined` while skipped).
 */
export function useStoreCreditBalance(userId?: string, storeId?: string) {
  const key =
    userId && storeId
      ? `/api/admin/store-credit/balance?user_id=${encodeURIComponent(userId)}`
      : null;
  return useSWR<StoreCreditBalance>(key, fetcher);
}

/**
 * Subscribes to a customer's store-credit ledger entries.
 *
 * @param userId - Identity-service id of the customer whose ledger to load.
 * @param storeId - Active store id; required to enable the request.
 * @returns The SWR response whose `data` is `{ entries }` (or `undefined` while the key is `null`).
 */
export function useStoreCreditLedger(userId?: string, storeId?: string) {
  const key =
    userId && storeId
      ? `/api/admin/store-credit/ledger?user_id=${encodeURIComponent(userId)}`
      : null;
  return useSWR<{ entries: StoreCreditLedgerEntry[] }>(key, fetcher);
}

/**
 * Subscribes to a customer's store-credit reconcile report.
 *
 * @param userId - Identity-service id of the customer whose report to load.
 * @param storeId - Active store id; required to enable the request.
 * @returns The SWR response whose `data` is a `StoreCreditReconcileReport` (or `undefined` while skipped).
 */
export function useStoreCreditReconcile(userId?: string, storeId?: string) {
  const key =
    userId && storeId
      ? `/api/admin/store-credit/reconcile?user_id=${encodeURIComponent(userId)}`
      : null;
  return useSWR<StoreCreditReconcileReport>(key, fetcher);
}

/**
 * Grants store credit to a customer.
 *
 * @remarks
 * Sends an `Idempotency-Key` header (caller-provided or generated) and the
 * `X-Store-ID` header so retries cannot double-credit an account.
 *
 * @param userId - Identity-service id of the customer receiving credit.
 * @param amount - Credit amount in minor units.
 * @param currency - ISO currency code, e.g. `"USD"`.
 * @param reason - Operator-facing reason recorded on the ledger entry.
 * @param storeId - Store the credit belongs to.
 * @param idempotencyKey - Optional key to reuse; generated when omitted.
 * @returns The backend response body for the created grant.
 * @throws {@link Error} When the request fails (e.g. rejected validation).
 */
export async function grantStoreCredit(
  userId: string,
  amount: number,
  currency: string,
  reason: string,
  storeId: string,
  idempotencyKey?: string,
) {
  const idem =
    idempotencyKey ||
    `admin-grant-${userId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const res = await axiosInstance.post(
    "/api/admin/store-credit/grants",
    { user_id: userId, amount, currency, reason },
    {
      headers: {
        "X-Store-ID": storeId,
        "Idempotency-Key": idem,
      },
    },
  );
  return res.data;
}

/**
 * Adjusts a customer's store-credit balance (positive or negative correction).
 *
 * @remarks
 * Sends an `Idempotency-Key` header (caller-provided or generated) and the
 * `X-Store-ID` header so retries cannot double-apply the adjustment.
 *
 * @param userId - Identity-service id of the customer being adjusted.
 * @param amount - Adjustment amount in minor units; may be negative.
 * @param currency - ISO currency code, e.g. `"USD"`.
 * @param reason - Operator-facing reason recorded on the ledger entry.
 * @param storeId - Store the adjustment belongs to.
 * @param idempotencyKey - Optional key to reuse; generated when omitted.
 * @returns The backend response body for the created adjustment.
 * @throws {@link Error} When the request fails (e.g. insufficient balance).
 */
export async function adjustStoreCredit(
  userId: string,
  amount: number,
  currency: string,
  reason: string,
  storeId: string,
  idempotencyKey?: string,
) {
  const idem =
    idempotencyKey ||
    `admin-adjust-${userId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const res = await axiosInstance.post(
    "/api/admin/store-credit/adjustments",
    { user_id: userId, amount, currency, reason },
    {
      headers: {
        "X-Store-ID": storeId,
        "Idempotency-Key": idem,
      },
    },
  );
  return res.data;
}
