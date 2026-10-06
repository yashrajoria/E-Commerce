import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { useProductById } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { formatGBP } from "@/lib/utils";
import type { Product } from "@/lib/types";
import type { GetServerSideProps } from "next";
import { fetchProductByIdSsr } from "@/lib/ssrProducts";

type ProductPageProps = {
  initialProduct: Product | null;
};

export default function ProductPage({ initialProduct }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { showSuccess, showInfo } = useToast();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;
  const { data: product, isLoading } = useProductById(id, {
    initialData: initialProduct ?? undefined,
  });
  const { addToWishlist, removeFromWishlist, hasWishlistItem } = useWishlist();

  const rating = product?.rating ?? 0;
  const images = (product?.images ?? []).filter(Boolean);
  const categoryName = product
    ? typeof product.category === "string"
      ? product.category
      : product.category?.name
    : "";
  const categoryId =
    product && typeof product.category !== "string"
      ? product.category?.id
      : undefined;
  const isWishlisted = product ? hasWishlistItem(product.id) : false;

  // Use `inStock` from `Product` type if provided; default to false
  const isOutOfStock = product ? product.inStock === false : false;

  // use shared formatter from utils

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product || !id) return;
    addToCart({
      ...product,
      id: String(id),
      images: product?.images ?? [],
      quantity,
    });
    showSuccess(`${product.name} has been added to your cart.`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showSuccess(`${product.name} has been removed from your wishlist.`);
    } else {
      addToWishlist(product);
      showSuccess(`${product.name} has been added to your wishlist.`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.name,
          text: `Check out this product: ${product?.name}`,
          url: window.location.href,
        })
        .catch(() => {
          // ignore
        });
    } else {
      showInfo("Web Share API is not supported in your browser.");
    }
  };

  if (!router.isReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-rose-200 border-t-rose-600 animate-spin" />
          <h1 className="text-xl font-semibold">Loading product details</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fetching the latest product information.
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
          <h1 className="text-xl font-semibold">Failed to load product</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The product could not be loaded right now. Please try again.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/products">Back to products</Link>
            </Button>
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>{product.name} | ShopSwift</title>
        <meta
          name="description"
          content={
            product.description ||
            `Buy ${product.name} at the best price with fast delivery.`
          }
        />
        <link rel="canonical" href={`${siteUrl}/products/${id}`} />
        <meta property="og:title" content={`${product.name} | ShopSwift`} />
        <meta
          property="og:description"
          content={
            product.description ||
            `Buy ${product.name} at the best price with fast delivery.`
          }
        />
        {product.images?.[0] && (
          <meta property="og:image" content={product.images[0]} />
        )}
        <meta property="og:url" content={`${siteUrl}/products/${id}`} />
      </Head>
      <Header />

      <main className="container mx-auto px-4 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductImageGallery images={images} />
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <nav
              aria-label="Breadcrumb"
              className="text-sm text-muted-foreground"
            >
              <Link href="/" className="hover:text-rose-600">
                Home
              </Link>
              <span className="mx-2">/</span>
              {categoryName ? (
                <Link
                  href={
                    categoryId
                      ? `/products?categoryId=${encodeURIComponent(categoryId)}&category=${encodeURIComponent(categoryName)}`
                      : `/products?category=${encodeURIComponent(categoryName)}`
                  }
                  className="hover:text-rose-600"
                >
                  {categoryName}
                </Link>
              ) : (
                <span className="hover:text-rose-600">Category</span>
              )}
              <span className="mx-2">/</span>
              <span aria-current="page">{product?.name}</span>
            </nav>

            <div>
              <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="font-medium">{rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product?.reviews} reviews)
                </span>
                <Badge variant="secondary">{product?.badge}</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">
                {formatGBP(product?.price)}
              </span>
              {product?.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatGBP(product?.originalPrice)}
                </span>
              )}
              {product?.originalPrice && (
                <Badge className="bg-red-500">
                  {Math.round(
                    ((product?.originalPrice - product?.price) /
                      product?.originalPrice) *
                      100,
                  )}
                  % OFF
                </Badge>
              )}
            </div>

            {product.description ? (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            ) : null}

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  className="w-16 text-center border-0"
                  value={quantity}
                  min={1}
                  aria-label="Quantity"
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setQuantity(Number.isNaN(v) ? 1 : Math.max(1, v));
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="lg"
                className="hidden sm:inline-flex flex-1 rounded-full bg-linear-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 shadow-lg shadow-rose-500/20"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                aria-disabled={isOutOfStock}
                aria-label={isOutOfStock ? "Out of stock" : "Add to bag"}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isOutOfStock ? "Out of stock" : "Add to Bag"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleWishlistToggle}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleShare}
                aria-label="Share product"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Shipping / returns near buy — trust signals before scroll */}
            <ul className="space-y-2 text-sm text-muted-foreground border-t border-border/60 pt-4">
              <li className="flex items-start gap-2">
                <Truck
                  className="h-4 w-4 mt-0.5 text-rose-600 shrink-0"
                  aria-hidden
                />
                <span>
                  Free standard delivery on orders over {formatGBP(50)} · Express
                  from {formatGBP(9.99)}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <RotateCcw
                  className="h-4 w-4 mt-0.5 text-rose-600 shrink-0"
                  aria-hidden
                />
                <span>30-day returns · Easy exchanges from your account</span>
              </li>
              <li className="text-xs">
                {isOutOfStock ? (
                  <span className="text-amber-700 dark:text-amber-400">
                    Currently out of stock
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400">
                    In stock
                    {categoryName ? ` · ${categoryName}` : ""}
                  </span>
                )}
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 pb-24 sm:pb-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-3">About this product</h3>
                {product.description ? (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    No detailed description is available for {product.name} yet.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4 border-b border-border/50 py-2">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium text-right">{product.name}</span>
                  </div>
                  {categoryName ? (
                    <div className="flex justify-between gap-4 border-b border-border/50 py-2">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-right">
                        {categoryName}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-4 border-b border-border/50 py-2">
                    <span className="text-muted-foreground">Availability</span>
                    <span className="font-medium text-right">
                      {isOutOfStock ? "Out of stock" : "In stock"}
                    </span>
                  </div>
                  {product.badge ? (
                    <div className="flex justify-between gap-4 border-b border-border/50 py-2">
                      <span className="text-muted-foreground">Badge</span>
                      <span className="font-medium text-right">
                        {product.badge}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4 border-b border-border/50 py-2">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium text-right">
                      {formatGBP(product.price)}
                    </span>
                  </div>
                  {product.originalPrice ? (
                    <div className="flex justify-between gap-4 border-b border-border/50 py-2">
                      <span className="text-muted-foreground">Was</span>
                      <span className="font-medium text-right line-through text-muted-foreground">
                        {formatGBP(product.originalPrice)}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-4 border-b border-border/50 py-2">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium text-right">
                      {rating} / 5 ({product.reviews ?? 0} reviews)
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-border/50 py-2">
                    <span className="text-muted-foreground">SKU</span>
                    <span className="font-medium text-right font-mono text-xs">
                      {product.id}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={product?.id} />
            </TabsContent>
          </Tabs>
        </motion.div>

        <RelatedProducts currentProductId={product?.id} />
      </main>

      {/* Sticky mobile Add to Bag */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md p-3 sm:hidden safe-area-pb">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatGBP(product.price)}
            </p>
          </div>
          <Button
            size="lg"
            className="shrink-0 rounded-full bg-linear-to-r from-rose-600 to-amber-500 px-6"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : "Add to bag"}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {isOutOfStock ? "Sold out" : "Add to Bag"}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (
  ctx,
) => {
  const rawId = ctx.params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return { notFound: true };
  }

  const initialProduct = await fetchProductByIdSsr(id);
  return { props: { initialProduct } };
};
