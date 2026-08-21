/**
 * transformProduct — Maps backend product response to frontend expected shape.
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

function isMongoObjectId(val) {
  return typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);
}

function resolveFromTitle(name = '') {
  const lower = (name || '').toLowerCase();
  if (lower.includes('sweatpant') || lower.includes('baggy') || lower.includes('pant') || lower.includes('trouser')) {
    return { name: 'Baggy Pants', slug: 'baggy-pants' };
  }
  if (lower.includes('t-shirt') || lower.includes('tee')) {
    return { name: 'Drop Shoulder T-Shirts', slug: 'drop-shoulder-t-shirts' };
  }
  if (lower.includes('sweatshirt') || lower.includes('hoodie')) {
    return { name: 'Sweatshirts', slug: 'sweatshirts' };
  }
  if (lower.includes('shirt')) {
    return { name: 'Shirts', slug: 'shirts' };
  }
  if (lower.includes('jersey')) {
    return { name: 'Jerseys', slug: 'jerseys' };
  }
  return { name: 'Apparel', slug: 'shop' };
}

function resolveCategory(cat, productName = '') {
  if (!cat) return resolveFromTitle(productName);

  if (typeof cat === 'object') {
    const name = cat.name || cat.title || '';
    const slug = cat.slug || '';
    if (name && !isMongoObjectId(name)) {
      return { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-') };
    }
  }

  // Try checking localStorage cache if populated
  try {
    const cached = localStorage.getItem("luxury_categories");
    if (cached) {
      const pool = JSON.parse(cached);
      const targetId = typeof cat === 'object' ? (cat._id || cat.id || cat.slug) : cat;
      const found = pool.find(c => String(c._id || c.id) === String(targetId) || String(c.slug) === String(targetId));
      if (found && found.name && !isMongoObjectId(found.name)) {
        return { name: found.name, slug: found.slug || found.name.toLowerCase().replace(/\s+/g, '-') };
      }
    }
  } catch (_) {}

  if (typeof cat === 'string') {
    if (!isMongoObjectId(cat)) {
      return { name: cat, slug: cat.toLowerCase().replace(/\s+/g, '-') };
    }
  }

  return resolveFromTitle(productName);
}

export function transformProduct(p) {
  if (!p) return null;

  // --- Price logic ---
  let price, originalPrice;
  if (p.type === 'variant' && p.variants?.length > 0) {
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
    if (p.offerPrice && p.offerPrice < p.price) {
      price = p.offerPrice;
      originalPrice = p.price;
    } else {
      price = p.price || 0;
      originalPrice = null;
    }
  }

  // --- Image logic ---
  const rawImage = p.imageUrl || p.image_url || p.image || '';
  const image = formatImageUrl(rawImage);
  const rawImagesList = Array.isArray(p.images) ? p.images : (Array.isArray(p.galleryImages) ? p.galleryImages : []);
  const galleryImages = rawImagesList
    .sort((a, b) => ((typeof a === 'object' ? a.sortOrder : 0) || 0) - ((typeof b === 'object' ? b.sortOrder : 0) || 0))
    .map((img) => formatImageUrl(typeof img === 'object' ? (img?.url || img?.imageUrl || img?.image || '') : img))
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
  const cleanDescription = p.description ? p.description.replace(/<[^>]*>/g, '') : '';
  const tagline = cleanDescription
    ? cleanDescription.length > 120
      ? cleanDescription.substring(0, 117) + '...'
      : cleanDescription
    : '';

  // --- Category: resolve to display name & slug ---
  let rawCat = null;
  if (p._populatedCategories && p._populatedCategories.length > 0) {
    rawCat = p._populatedCategories[0];
  } else if (p.category) {
    rawCat = p.category;
  } else if (Array.isArray(p.categories) && p.categories.length > 0) {
    rawCat = p.categories[0];
  } else if (p.categoryName) {
    rawCat = p.categoryName;
  }

  const { name: categoryName, slug: categorySlug } = resolveCategory(rawCat, p.name);

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

    // Variants
    variants,
    sizes,
    colors: [],

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
    isBestSeller: false,
    rating: 0,
    reviewsCount: 0,
    gender: 'Unisex',

    // Detail fields
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
