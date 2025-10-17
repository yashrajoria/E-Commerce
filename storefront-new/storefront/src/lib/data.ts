import { Collection, Product, Category } from "./types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    icon: "Smartphone",
    image:
      "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 1250,
  },
  {
    id: "2",
    name: "Fashion",
    icon: "Shirt",
    image:
      "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 890,
  },
  {
    id: "3",
    name: "Home & Garden",
    icon: "Home",
    image:
      "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 650,
  },
  {
    id: "4",
    name: "Sports",
    icon: "Dumbbell",
    image:
      "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 420,
  },

  {
    id: "5",
    name: "Books",
    icon: "BookOpen",
    image:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 780,
  },
  {
    id: "6",
    name: "Beauty",
    icon: "Sparkles",
    image:
      "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400",
    productCount: 340,
  },
];

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 129.99,
    image:
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.8,
    reviews: 1250,
    category: "Electronics",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 299.99,
    image:
      "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.6,
    reviews: 890,
    category: "Electronics",
    badge: "33% OFF",
    inStock: true,
  },
  {
    id: "3",
    name: "Premium Coffee Maker",
    price: 149.99,
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.9,
    reviews: 456,
    category: "Home & Garden",
    inStock: true,
  },
  {
    id: "4",
    name: "Wireless Charging Pad",
    price: 34.99,
    originalPrice: 49.99,
    image:
      "https://images.pexels.com/photos/4968636/pexels-photo-4968636.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.5,
    reviews: 324,
    category: "Electronics",
    inStock: true,
  },
  {
    id: "5",
    name: "Designer Backpack",
    price: 89.99,
    image:
      "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.7,
    reviews: 678,
    category: "Fashion",
    badge: "New Arrival",
    inStock: true,
  },
  {
    id: "6",
    name: "Yoga Mat Pro",
    price: 49.99,
    originalPrice: 69.99,
    image:
      "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.8,
    reviews: 234,
    category: "Sports",
    inStock: true,
  },
];

export const collections: Collection[] = [
  {
    id: "1",
    title: "Tech Essentials",
    subtitle: "Latest gadgets for modern life",
    image:
      "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800",
    layout: "large",
    products: featuredProducts.slice(0, 4),
  },
  {
    id: "2",
    title: "Home Comfort",
    subtitle: "Upgrade your living space",
    image:
      "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600",
    layout: "medium",
    products: featuredProducts.slice(2, 5),
  },
  {
    id: "3",
    title: "Active Lifestyle",
    subtitle: "Gear for fitness enthusiasts",
    image:
      "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=600",
    layout: "medium",
    products: featuredProducts.slice(1, 4),
  },
];
