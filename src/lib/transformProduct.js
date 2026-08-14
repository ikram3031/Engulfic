/**
 * transformProduct — Maps backend product response to frontend expected shape.
 *
 * Backend fields → Frontend fields:
 *   id            → id
 *   name          → name
 *   slug          → slug
 *   description   → description, tagline (first 120 chars)
 *   price         → originalPrice (when offerPrice exists)
 *   offerPrice    → price (current selling price)
 *   imageUrl      → image
 *   images[0].url → secondaryImage
 *   stockStatus   → inStock
 *   stockQuantity → stockCount
 *   variants      → variants, sizes (extracted)
 *   categories    → categories (kept as-is for filtering)
 *   tags          → tags
 *   notes         → notes
 *   type          → type
 *   createdAt     → createdAt, isNew (< 30 days)
 */

const API_BASE = (
  import.meta.env?.VITE_IMAGE_BASE_URL ||
  import.meta.env?.NEXT_PUBLIC_IMAGE_BASE_URL ||
  import.meta.env?.VITE_API_URL ||
  import.meta.env?.NEXT_PUBLIC_API_URL ||
  'https://server.engulfic.com'
).replace(/\/$/, '');

function formatImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const clean = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE}${clean}`;
}

export function transformProduct(p) {
  if (!p) return null;

  // --- Price logic ---
  let price, originalPrice;
  if (p.type === 'variant' && p.variants?.length > 0) {
    // Sort by sortOrder, use first variant's prices
    const sorted = [...p.variants].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const first = sorted[0];
    if (first.offerPrice && first.offerPrice < first.price) {
      price = first.offerPrice;
      originalPrice = first.price;
    } else {
      price = first.price;
      originalPrice = null;
    }
  } else {
    // Simple product
    if (p.offerPrice && p.offerPrice < p.price) {
      price = p.offerPrice;
      originalPrice = p.price;
    } else {
      price = p.price || 0;
      originalPrice = null;
    }
  }

  // --- Image logic ---
  const rawImage = p.imageUrl || p.image_url || '';
  const image = formatImageUrl(rawImage);
  const galleryImages = (p.images || [])
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((img) => formatImageUrl(img?.url || img))
    .filter(Boolean);
  const secondaryImage = galleryImages.length > 0 ? galleryImages[0] : image;

  // --- Stock logic ---
  let stockCount;
  if (p.type === 'variant' && p.variants?.length > 0) {
    stockCount = p.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
  } else {
    stockCount = p.stockQuantity || 0;
  }
  const inStock = p.stockStatus === 'instock';

  // --- Variants → sizes extraction ---
  const variants = (p.variants || []).map((v) => ({
    size: v.size,
    price: v.offerPrice && v.offerPrice < v.price ? v.offerPrice : v.price,
    originalPrice: v.offerPrice && v.offerPrice < v.price ? v.price : null,
    stockQuantity: v.stockQuantity || 0,
    sku: v.sku || '',
    imageUrl: v.imageUrl ? formatImageUrl(v.imageUrl) : null,
    sortOrder: v.sortOrder || 0,
  }));
  const sizes = variants.map((v) => v.size).filter(Boolean);

  // --- isNew: created within last 30 days ---
  const isNew = p.createdAt
    ? (Date.now() - new Date(p.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000
    : false;

  // --- Tagline: first 120 chars of description ---
  const tagline = p.description
    ? p.description.length > 120
      ? p.description.substring(0, 117) + '...'
      : p.description
    : '';

  // --- Category: resolve to display name if populated ---
  // Backend may populate categories as objects or return as IDs
  let categoryName = '';
  let categorySlug = '';
  if (p._populatedCategories && p._populatedCategories.length > 0) {
    categoryName = p._populatedCategories[0].name || '';
    categorySlug = p._populatedCategories[0].slug || '';
  } else if (p.categoryName) {
    // If the API enriches category name
    categoryName = p.categoryName;
    categorySlug = p.categorySlug || '';
  }

  return {
    // Core identity
    id: p.id || p._id || '',
    name: p.name || '',
    slug: p.slug || '',
    did: p.did || '',

    // Display text
    tagline,
    description: p.description || '',
    longDescription: p.longDescription || '',

    // Pricing
    price,
    originalPrice,
    type: p.type || 'simple',

    // Variants (for chip display)
    variants,
    sizes,
    colors: [], // Backend has no colors — hide color swatches

    // Stock
    inStock,
    stockCount,
    stockStatus: p.stockStatus || 'instock',
    sku: p.sku || '',

    // Images
    image,
    secondaryImage,
    galleryImages,
    thumbnailUrl: p.thumbnailUrl || p.thumbnail_url || image,

    // Categorization
    category: categoryName,
    categorySlug,
    categories: p.categories || [],
    tags: p.tags || [],
    notes: p.notes || [],
    season: p.season || 'All-Season',

    // Flags
    isNew,
    isBestSeller: false, // No backend field
    rating: 0,           // No backend field
    reviewsCount: 0,     // No backend field
    gender: 'Unisex',    // No backend field

    // Detail fields (may be empty)
    fabric: '',
    care: '',
    fit: '',

    // SEO
    metaData: p.metaData || {},

    // Timestamps
    createdAt: p.createdAt || p.created_at || null,
    updatedAt: p.updatedAt || p.updated_at || null,
  };
}

/**
 * Transform an array of backend products
 */
export function transformProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map(transformProduct).filter(Boolean);
}
