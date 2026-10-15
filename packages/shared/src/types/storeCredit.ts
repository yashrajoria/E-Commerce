/**
 * Kind of mutation recorded in the store-credit ledger.
 *
 * @remarks
 * `grant` adds credit, `debit` spends or adjusts it, `hold` reserves credit
 * during checkout, `capture` converts a hold into a spend, `release` returns a
 * hold and `refund` credits an amount back.
 */
export type StoreCreditEntryType =
  | "grant"
  | "debit"
  | "hold"
  | "capture"
  | "release"
  | "refund";

/** A single immutable row in the store-credit ledger. */
export interface StoreCreditLedgerEntry {
  /** Unique ledger entry identifier. */
  id: string;
  /** Store-credit account the entry belongs to. */
  account_id: string;
  /** Kind of mutation this entry records. */
  entry_type: StoreCreditEntryType;
  /** Signed amount of the entry, in major currency units. */
  amount: number;
  /** Change this entry applies to the available balance. */
  available_delta: number;
  /** Change this entry applies to the held balance. */
  held_delta: number;
  /** ISO 4217 currency code of the entry. */
  currency: string;
  /** Client-supplied key used by the backend to deduplicate retried writes. */
  idempotency_key?: string;
  /** Human-readable explanation recorded with the entry, e.g. "Order #1234 refund". */
  reason: string;
  /** Additional backend metadata, serialized as a JSON string. */
  metadata?: string;
  /** Id of the staff member or actor that created the entry; `null` for system writes. */
  created_by?: string | null;
  /** ISO timestamp of when the entry was recorded. */
  created_at: string;
}

/** Current store-credit balances for an account. */
export interface StoreCreditBalance {
  /** Credit that can be spent right away. */
  available_amount: number;
  /** Credit reserved by in-flight checkouts. */
  held_amount: number;
  /** Total credit on the account — `available_amount` plus `held_amount`. */
  total_amount: number;
  /** ISO 4217 currency code of the balances. */
  currency: string;
}

/** Result of comparing cached balances against the ledger for one account. */
export interface StoreCreditReconcileReport {
  /** Store-credit account that was reconciled. */
  account_id: string;
  /** User that owns the account. */
  user_id: string;
  /** Store the account belongs to. */
  store_id: string;
  /** ISO 4217 currency code of the reconciliation. */
  currency: string;
  /** Available balance recorded in the cache. */
  cached_available: number;
  /** Available balance recomputed from ledger entries. */
  ledger_available: number;
  /** Whether the cached and ledger available balances agree. */
  available_matched: boolean;
  /** Held balance recorded in the cache. */
  cached_held: number;
  /** Held balance recomputed from ledger entries. */
  ledger_held: number;
  /** Whether the cached and ledger held balances agree. */
  held_matched: boolean;
  /** Number of ledger entries included in the report. */
  total_ledger_entries: number;
}

/** Payload for granting store credit to a user (admin action). */
export interface StoreCreditGrantRequest {
  /** User that should receive the credit. */
  user_id: string;
  /** Amount of credit to grant, in major currency units. */
  amount: number;
  /** ISO 4217 currency code for the amount, when the caller specifies one. */
  currency?: string;
  /** Human-readable reason recorded on the ledger entry. */
  reason: string;
}

/** Payload for adjusting a user's store-credit balance (admin action). */
export interface StoreCreditAdjustRequest {
  /** User whose balance should be adjusted. */
  user_id: string;
  /** Amount of the adjustment, in major currency units. */
  amount: number;
  /** ISO 4217 currency code for the amount, when the caller specifies one. */
  currency?: string;
  /** Human-readable reason recorded on the ledger entry. */
  reason: string;
}
