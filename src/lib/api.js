import { transformProduct, transformProducts } from './transformProduct';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://server.engulfic.com';

export const getImageBaseUrl = () => {
  const envImgUrl =
    import.meta.env.VITE_IMAGE_BASE_URL ||
    import.meta.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'https://server.engulfic.com';
  return envImgUrl.replace(/\/$/, '');
};

// ── Sort key mapping (frontend → backend) ─────────────────────
const SORT_MAP = {
  'featured': 'newest',
  'newest': 'newest',
  'price-asc': 'price_low_to_high',
  'price-desc': 'price_high_to_low',
  'name-asc': 'name',
  'name': 'name',
  'rating': 'newest', // no rating field in backend, fall back
};

const CATEGORY_SLUG_MAP = {
  'tees': ['graphic-drop-shoulder-tee', 'drop-shoulder-tee', 'drop-shoulder-t-shirts'],
  't-shirt': ['graphic-drop-shoulder-tee', 'drop-shoulder-tee', 'drop-shoulder-t-shirts'],
  't-shirts': ['graphic-drop-shoulder-tee', 'drop-shoulder-tee', 'drop-shoulder-t-shirts'],
  'drop-shoulder-t-shirts': ['graphic-drop-shoulder-tee', 'drop-shoulder-tee', 'drop-shoulder-t-shirts'],
  'shirts': ['casual-shirt', 'oversized-shirt', 'shirts'],
  'sweatshirts': ['baggy-sweatpants', 'oversized-graphic-sweatshirt', 'solid-sweatshirt', 'sweatshirts'],
  'pants': ['baggy-sweatpants', 'baggy-graphic-sweatpants', 'baggy-pants'],
  'baggy-pants': ['baggy-sweatpants', 'baggy-graphic-sweatpants', 'baggy-pants'],
  'jerseys': ['player-edition', 'fan-edition', 'retro-edition', 'jerseys']
};

/**
 * Fetch a paginated, filtered list of products.
 * Returns: { products: TransformedProduct[], meta: {...} }
 */
export async function fetchProducts({
  category,
  searchQuery,
  sortBy,
  inStockOnly,
  limit = 100,
  skip = 0,
} = {}) {
  const url = new URL(`${BASE_URL}/api/v1/products`);
  const params = new URLSearchParams();

  if (category && category !== 'All' && category !== 'all') params.append('category', category);
  if (searchQuery && searchQuery.trim() !== '') params.append('q', searchQuery.trim());
  if (inStockOnly) params.append('stockStatus', 'instock');
  if (sortBy && SORT_MAP[sortBy]) params.append('sort', SORT_MAP[sortBy]);
  if (limit) params.append('limit', String(limit));
  if (skip) params.append('skip', String(skip));

  url.search = params.toString();

  const response = await fetch(url.toString());
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch products');
  }

  const json = await response.json();

  // Backend returns { success, message, meta, data: [...] }
  let rawProducts = json.data || json || [];
  
  if (rawProducts.length === 0 && category && CATEGORY_SLUG_MAP[category]) {
    const altSlugs = CATEGORY_SLUG_MAP[category];
    for (const alt of altSlugs) {
      if (alt === category) continue;
      try {
        const altUrl = new URL(`${BASE_URL}/api/v1/products`);
        const altParams = new URLSearchParams(params);
        altParams.set('category', alt);
        altUrl.search = altParams.toString();
        const altRes = await fetch(altUrl.toString());
        if (altRes.ok) {
          const altJson = await altRes.json();
          const altList = altJson.data || [];
          if (altList.length > 0) {
            rawProducts = rawProducts.concat(altList);
          }
        }
      } catch (_) {}
    }
  }

  return transformProducts(rawProducts);
}

/**
 * Fetch a single product by ID or slug.
 * Returns: TransformedProduct
 */
export async function fetchProductById(identifier) {
  const response = await fetch(`${BASE_URL}/api/v1/products/${identifier}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Product not found');
  }

  const json = await response.json();
  // Backend returns { data: {...} }
  const raw = json.data || json;
  return transformProduct(raw);
}

/**
 * Fetch featured / newest products (no dedicated endpoint — uses listing with sort).
 * Returns: TransformedProduct[]
 */
export async function fetchFeaturedProducts(limit = 12) {
  return fetchProducts({ sortBy: 'newest', limit });
}

/**
 * Lightweight product search for autocomplete.
 * Uses the dedicated /search-products endpoint that returns minimal fields.
 * Returns: Array<{ id, name, category, brand, image }>
 */
export async function searchProducts(query, limit = 12) {
  if (!query || !query.trim()) return [];

  const url = new URL(`${BASE_URL}/api/v1/search-products`);
  url.searchParams.append('q', query.trim());
  url.searchParams.append('limit', String(limit));

  const response = await fetch(url.toString());
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Search failed');
  }

  const json = await response.json();
  // Backend returns { data: [...] } with minimal fields
  const results = json.data || json || [];

  // Map to the shape SearchModal expects
  return results.map((item) => ({
    id: item.id || item._id || '',
    name: item.name || '',
    category: typeof item.category === 'object' ? (item.category?.name || '') : (item.category || ''),
    brand: item.brand || '',
    image: item.image || item.imageUrl || item.image_url || '',
    slug: item.slug || '',
  }));
}

/**
 * Fetch all categories.
 * Returns: Array<{ id, name, slug, description, imageUrl, productCount }>
 */
export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/api/v1/categories`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch categories');
  }

  const json = await response.json();
  const raw = json.data || json || [];

  return raw.map((cat) => ({
    id: cat.id || cat._id || '',
    name: cat.name || '',
    slug: cat.slug || '',
    did: cat.did || '',
    description: cat.description || '',
    imageUrl: cat.imageUrl || '',
    productCount: cat.product_count || cat.productCount || 0,
    parent: cat.parent || null,
  }));
}

/**
 * Subscribe email to newsletter / Runway Club
 */
export async function subscribeNewsletter(email) {
  const url = `${BASE_URL}/api/v1/subscribers`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email: String(email).trim() }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || 'Failed to subscribe. Please try again.');
  }

  return json;
}

// Alias for search and details to align core API consumers
export const fetchProductDetails = fetchProductById;

// Re-export authentication and membership functions from core API
export {
  refreshMemberSession,
  fetchCombos,
  fetchCouponByCode,
  createOrder,
  checkMemberEmail,
  loginMember,
  registerMember,
  verifyMemberOtp,
  resendMemberOtp,
  forgotMemberPassword,
  resetMemberPassword,
  refreshMemberToken,
  logoutMember,
  fetchMembers,
  fetchMemberById,
  createMember,
  updateMember,
  deleteMember,
  getStoredMemberTokens,
  clearStoredMemberTokens,
  setStoredMemberTokens
} from '@/core/lib/api';
