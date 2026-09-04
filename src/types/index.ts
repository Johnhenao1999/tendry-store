// Types for the store

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  isNew: boolean;
  isFeatured: boolean;
  size: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

export type ProductCategory = 
  | 'anillos'
  | 'pulseras'
  | 'sets-regalo'
  | 'novedades'
  | 'piezas-exclusivas';

export interface Category {
  id: ProductCategory;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
