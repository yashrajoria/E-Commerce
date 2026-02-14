import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  Share2,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { useCart } from "@/context/CartContext";
import { useProductById } from "@/hooks/useProducts";
import { useRouter } from "next/router";
import Head from "next/head";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { toast } = useToast();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;
  const { data: product, isLoading, error } = useProductById(id);
  const { addToWishlist, removeFromWishlist, hasWishlistItem } = useWishlist();

  const rating = product?.rating ?? 0;
  const images = (product?.images ?? []).filter(Boolean);
  const isWishlisted = hasWishlistItem(product?.id);

  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product || !id) return;
    addToCart({
      ...product,
      id: String(id),
      images: product?.images ?? [],
      quantity,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
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
        .catch((error) => console.error("Error sharing", error));
    } else {
      toast({
        title: "Share",
        description: "Web Share API is not supported in your browser.",
      });
    }
  };

  if (!router.isReady || isLoading) {
    return <div className="min-h-screen">Loading...</div>;
  }

  if (error || !product) {
    return <div className="min-h-screen">Failed to load product.</div>;
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>{product.name} | Storefront</title>
        <meta
          name="description"
          content={
            product.description ||
            `Buy ${product.name} at the best price with fast delivery.`
          }
        />
        <link rel="canonical" href={`${siteUrl}/products/${id}`} />
        <meta property="og:title" content={`${product.name} | Storefront`} />
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
            <div className="text-sm text-muted-foreground">
              <span className="hover:text-rose-600 cursor-pointer">Home</span>
              <span className="mx-2">/</span>
              <span className="hover:text-rose-600 cursor-pointer">
                {product?.category}
              </span>
              <span className="mx-2">/</span>
              <span>{product?.name}</span>
            </div>

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

            <p className="text-muted-foreground leading-relaxed">
              {product?.description ||
                "This is a detailed description of the product, highlighting its features, benefits, and usage."}
            </p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  className="w-16 text-center border-0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="lg"
                className="flex-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 shadow-lg shadow-rose-500/20"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Bag
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleWishlistToggle}
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
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3>Product Description</h3>
                <p>
                  Our {product?.name} represents the perfect blend of
                  functionality and style. Crafted with premium materials and
                  attention to detail, this product is designed to exceed your
                  expectations.
                </p>
                <h4>Key Features:</h4>
                <ul>
                  <li>Premium quality materials</li>
                  <li>Ergonomic design for comfort</li>
                  <li>Durable construction</li>
                  <li>Easy maintenance</li>
                  <li>Versatile usage</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Brand:</span>
                      <span>SuperStore</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Model:</span>
                      <span>SS-{product?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span>1.2 kg</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Dimensions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span>25 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Width:</span>
                      <span>15 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Height:</span>
                      <span>10 cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={product?.id} />
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Shipping Information</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Standard Delivery</h5>
                    <p className="text-sm text-muted-foreground">
                      5-7 business days - Free on orders over $50
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Express Delivery</h5>
                    <p className="text-sm text-muted-foreground">
                      2-3 business days - $9.99
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <RelatedProducts currentProductId={product?.id} />
      </main>

      <Footer />
    </div>
  );
}
