export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviews: number;
  category: string;
  badge?: string;
  quantity?: number;
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
