import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  sku?: string;
  specifications?: { name: string; value: string }[];
  rating: number;
  reviewCount: number;
  discountPercentage?: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
  isActive: boolean;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface FeaturedResponse {
  success: boolean;
  data: Product[];
}

export function useProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ProductsResponse = await api.getProducts(params);
      setProducts(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, pagination, loading, error, refetch: fetchProducts };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: FeaturedResponse = await api.getFeaturedProducts();
        setProducts(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar productos destacados');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { products, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: CategoriesResponse = await api.getCategories();
        setCategories(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar categorías');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await api.getProduct(slug);
        setProduct(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el producto');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}
