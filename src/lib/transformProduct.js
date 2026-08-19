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

const DB_CATEGORY_MAP = {
  '6a7f12afe92cea5ce35c2ce4': { name: 'Sweatshirts', slug: 'sweatshirts' },
  '6a7f12e0e92cea5ce35c2ceb': { name: 'Oversized Sweatshirt', slug: 'oversized-sweatshirt' },
  '6a7f133fe92cea5ce35c2cf3': { name: 'Oversized Graphic Sweatshirt', slug: 'oversized-graphic-sweatshirt' },
  '6a7f15766cb27019830ecb70': { name: 'Baggy Pants', slug: 'baggy-pants' },
  '6a7f15806cb27019830ecb78': { name: 'Baggy Sweatpants', slug: 'baggy-sweatpants' },
  '6a7f15976cb27019830ecb80': { name: 'Baggy Graphic Sweatpants', slug: 'baggy-graphic-sweatpants' },
  '6a7f160c6cb27019830ecb89': { name: 'Shirts', slug: 'shirts' },
  '6a7f16156cb27019830ecb91': { name: 'Oversized Shirt', slug: 'oversized-shirt' },
  '6a7f16256cb27019830ecb99': { name: 'Casual Shirt', slug: 'casual-shirt' },
  '6a7f16466cb27019830ecba5': { name: 'Drop Shoulder T-Shirts', slug: 'drop-shoulder-t-shirts' },
  '6a7f164f6cb27019830ecbad': { name: 'Drop Shoulder Tee', slug: 'drop-shoulder-tee' },
  '6a7f16586cb27019830ecbb5': { name: 'Graphic Drop Shoulder Tee', slug: 'graphic-drop-shoulder-tee' },
  '6a7f16626cb27019830ecbbc': { name: 'Jerseys', slug: 'jerseys' },
  '6a7f16736cb27019830ecbc4': { name: 'Player Edition', slug: 'player-edition' },
  '6a7f16896cb27019830ecbcc': { name: 'Fan Edition', slug: 'fan-edition' },
  '6a7f169f6cb27019830ecbd4': { name: 'Retro Edition', slug: 'retro-edition' },
};

function isMongoObjectId(val) {
  return typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);
}

function resolveFromTitle(name = '') {
  const lower = name.toLowerCase();
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
    if (cat._id && DB_CATEGORY_MAP[cat._id]) return DB_CATEGORY_MAP[cat._id];
    if (cat.id && DB_CATEGORY_MAP[cat.id]) return DB_CATEGORY_MAP[cat.id];
  }

  if (typeof cat === 'string') {
    if (DB_CATEGORY_MAP[cat]) return DB_CATEGORY_MAP[cat];
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
