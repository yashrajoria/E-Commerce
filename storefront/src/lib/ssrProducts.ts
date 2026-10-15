import { getBackendBaseUrl } from "@ecommerce/shared";
import type { Product } from "@/lib/types";

type ProductsMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

/**
 * Paginated server-side product payload returned by {@link fetchProductsSsr}.
 */
export type SsrProductsResponse = {
  /** Pagination metadata reported by the catalog API. */
  meta: ProductsMeta;
  /** Products for the requested page. */
  products: Product[];
};

function normalizeProduct(
  raw: Record<string, unknown>,
  fallbackId?: string,
): Product {
  return {
    ...(raw as unknown as Product),
    id: String(raw.id ?? raw._id ?? fallbackId ?? ""),
  };
}

/**
 * Server-side product fetch for Pages Router SSR (SEO / first paint).
 *
 * @param id - Product identifier to look up.
 * @param options - Optional store scoping; falls back to `NEXT_PUBLIC_DEFAULT_STORE_SLUG` for the store slug.
 * @returns The normalized product, or `null` when the request fails or times out (4s) or the API returns a non-OK status.
 */
export async function fetchProductByIdSsr(
  id: string,
  options?: { storeSlug?: string; storeId?: string },
): Promise<Product | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const storeSlug =
      options?.storeSlug || process.env.NEXT_PUBLIC_DEFAULT_STORE_SLUG;
    if (storeSlug) headers["X-Store-Slug"] = storeSlug;
    if (options?.storeId) headers["X-Store-ID"] = options.storeId;

    const res = await fetch(
      `${getBackendBaseUrl()}/products/${encodeURIComponent(id)}`,
      {
        headers,
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    return normalizeProduct(data, id);
  } catch {
    return null;
  }
}

/**
 * Server-side paginated product fetch used by catalog SSR.
 *
 * @param options - Paging (`page` defaults to 1, `perPage` to 12) and optional store scoping; the store slug falls back to `NEXT_PUBLIC_DEFAULT_STORE_SLUG`.
 * @returns The paged response with normalized products, or `null` when the request fails or times out (4s) or the API returns a non-OK status.
 */
export async function fetchProductsSsr(options?: {
  page?: number;
  perPage?: number;
  storeSlug?: string;
  storeId?: string;
}): Promise<SsrProductsResponse | null> {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 12;
  try {
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
    });
    const headers: Record<string, string> = { Accept: "application/json" };
    const storeSlug =
      options?.storeSlug || process.env.NEXT_PUBLIC_DEFAULT_STORE_SLUG;
    if (storeSlug) headers["X-Store-Slug"] = storeSlug;
    if (options?.storeId) headers["X-Store-ID"] = options.storeId;

    const res = await fetch(
      `${getBackendBaseUrl()}/products?${params.toString()}`,
      {
        headers,
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      meta?: ProductsMeta;
      products?: Array<Record<string, unknown>> | null;
    };
    const products = Array.isArray(data.products)
      ? data.products.map((p) => normalizeProduct(p))
      : [];
    return {
      meta: data.meta ?? {
        page,
        perPage,
        total: products.length,
        totalPages: 1,
      },
      products,
    };
  } catch {
    return null;
  }
}
