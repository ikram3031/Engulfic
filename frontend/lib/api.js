import { PRODUCTS } from './products';

// Simulated API calls for TanStack Query
export async function fetchProducts({ category, searchQuery, sortBy, inStockOnly, gender }) {
  // Simulate network latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  let result = [...PRODUCTS];

  if (category && category !== 'All') {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (gender && gender !== 'All') {
    result = result.filter((p) => p.gender === gender || p.gender === 'Unisex');
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  if (sortBy) {
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'new') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
  }

  return result;
}

export async function fetchProductById(id) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error('Product not found');
  return product;
}

export async function fetchFeaturedProducts() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return PRODUCTS.filter((p) => p.isBestSeller || p.isNew);
}
