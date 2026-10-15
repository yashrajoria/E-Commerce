import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgres://postgres:admin@localhost:5432/ecommerce?sslmode=disable";

/**
 * Process-wide cache of {@link pool} used in development so hot reloads reuse
 * one pool instead of exhausting database connections.
 */
declare global {
  var __dbPool: Pool | undefined;
}

/** Shared PostgreSQL connection pool (max 10 connections, 30s idle timeout, 5s connect timeout). */
export const pool: Pool =
  global.__dbPool ||
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  global.__dbPool = pool;
}

/**
 * Runs a parameterized SQL statement on the shared {@link pool}.
 *
 * @param text - SQL statement, using `$1`, `$2`, ... placeholders.
 * @param params - Values bound to the statement's placeholders.
 * @returns The result rows, typed as `T` (defaults to a generic record shape).
 * @throws {@link Error} When the pool cannot hand out a client or PostgreSQL
 * rejects the statement; the client is always released back to the pool.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}
