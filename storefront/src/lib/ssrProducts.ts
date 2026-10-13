import { getBackendBaseUrl } from "@ecommerce/shared";
import type { Product } from "@/lib/types";

type ProductsMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type SsrProductsResponse = {
  meta: ProductsMeta;
  products: Product[];
};

function normalizeProduct(raw: Record<string, unknown>, fallbackId?: string): Product {
  return {
    ...(raw as unknown as Product),
    id: String(raw.id ?? raw._id ?? fallbackId ?? ""),
  };
}

/** Server-side product fetch for Pages Router SSR (SEO / first paint). */
export async function fetchProductByIdSsr(
  id: string,
  options?: { storeSlug?: string; storeId?: string },
): Promise<Product | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const storeSlug = options?.storeSlug || process.env.NEXT_PUBLIC_DEFAULT_STORE_SLUG;
    if (storeSlug) headers["X-Store-Slug"] = storeSlug;
    if (options?.storeId) headers["X-Store-ID"] = options.storeId;

    const res = await fetch(`${getBackendBaseUrl()}/products/${encodeURIComponent(id)}`, {
      headers,
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    return normalizeProduct(data, id);
  } catch {
    return null;
  }
}

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
    const storeSlug = options?.storeSlug || process.env.NEXT_PUBLIC_DEFAULT_STORE_SLUG;
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
