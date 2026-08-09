import { PRODUCTS } from './products';

// Real API calls using the backend server
export async function fetchProducts({ category, searchQuery, sortBy, inStockOnly, gender }) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = new URL(`${baseUrl}/api/v1/products`);
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (gender && gender !== 'All') params.append('gender', gender);
  if (searchQuery && searchQuery.trim() !== '') params.append('search', searchQuery.trim());
  if (inStockOnly) params.append('inStockOnly', 'true');
  if (sortBy) params.append('sortBy', sortBy);
  url.search = params.toString();

  const response = await fetch(url.toString());
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch products');
  }
  const data = await response.json();
  return data;
}

export async function fetchProductById(id) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${baseUrl}/api/v1/products/${id}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Product not found');
  }
  return await response.json();
}

export async function fetchFeaturedProducts() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${baseUrl}/api/v1/products/featured`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch featured products');
  }
  return await response.json();
}
