import { GetServerSideProps } from "next";
import Head from "next/head";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/common/product-card";
import { getBackendBaseUrl, type Store } from "@ecommerce/shared";
import { fetchProductsSsr } from "@/lib/ssrProducts";
import type { Product } from "@/lib/types";
import { Store as StoreIcon, Sparkles, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StorePageProps {
  store: Store;
  products: Product[];
  total: number;
}

export default function StoreHomePage({ store, products, total }: StorePageProps) {
  return (
    <>
      <Head>
        <title>{store.name} | ShopSwift Store</title>
        <meta
          name="description"
          content={store.description || `Browse and buy from ${store.name} on ShopSwift.`}
        />
        <meta property="og:title" content={`${store.name} - ShopSwift`} />
        <meta
          property="og:description"
          content={store.description || `Browse products from ${store.name}.`}
        />
      </Head>

      <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <div>
          <Header />

          {/* Store Hero Banner */}
          <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
                    <StoreIcon size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        {store.name}
                      </h1>
                      <Badge variant="outline" className="text-xs uppercase font-mono">
                        {store.currency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xl">
                      {store.description || `Welcome to ${store.name}. Verified merchant store.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-muted/60 border border-border text-center">
                    <span className="block text-xl font-bold leading-none">{total}</span>
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                      Products
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="container mx-auto px-4 sm:px-6 py-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Store Collection
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl border-border bg-muted/20">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Catalog being curated
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  This merchant hasn&apos;t published any public products yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug;
  if (!slug || typeof slug !== "string") {
    return { notFound: true };
  }

  try {
    const backendUrl = getBackendBaseUrl();
    const res = await fetch(`${backendUrl}/stores/by-slug/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      return { notFound: true };
    }

    const data = await res.json();
    const store: Store = data.store || data;

    const productsData = await fetchProductsSsr({
      storeSlug: slug,
      perPage: 24,
    });

    return {
      props: {
        store,
        products: productsData?.products || [],
        total: productsData?.meta?.total || 0,
      },
    };
  } catch (err) {
    console.error("Failed to load store by slug:", err);
    return { notFound: true };
  }
};
