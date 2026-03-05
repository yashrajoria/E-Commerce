export interface Product {
  _id?: string;
  id?: string;
  name?: string;
  category?: string;
  category_ids?: string[];
  price?: number;
  quantity?: number;
  status?: string;
  images?: string[];
  description?: string;
  compareAtPrice?: number;
  totalSales?: number;
  views?: number | string;
  sku?: string;
}

export interface Category {
  _id?: string;
  id?: string;
  name?: string;
}

export type ID = string;
