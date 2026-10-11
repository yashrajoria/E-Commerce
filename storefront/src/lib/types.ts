import type {
  Product as BaseProduct,
  Category as BaseCategory,
  Collection as BaseCollection,
} from "@ecommerce/shared";

export interface Product extends BaseProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export interface Category extends BaseCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Collection extends Omit<BaseCollection, "products"> {
  products: Product[];
}

export type {
  Customer,
  Address,
  Order,
  OrderItem,
  OrderStatus,
} from "@ecommerce/shared";
