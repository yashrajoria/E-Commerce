export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description?: string;
  rating: number;
  reviews: number;
  // Backend may return category as an ID/name string or a populated object
  category: string | { id?: string; name: string };
  badge?: string;
  quantity?: number;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  products: Product[];
  layout: "large" | "medium" | "small";
}
