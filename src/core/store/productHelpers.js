const API_BASE = (
  import.meta.env?.VITE_IMAGE_BASE_URL ||
  import.meta.env?.NEXT_PUBLIC_IMAGE_BASE_URL ||
  import.meta.env?.VITE_API_URL ||
  import.meta.env?.NEXT_PUBLIC_API_URL ||
  'https://server.engulfic.com'
).replace(/\/$/, '');

export const normalizeProductImage = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }
  
  let cleanUrl = url;
  if (cleanUrl.startsWith("/content/")) {
    cleanUrl = cleanUrl.replace("/content/", "/uploads/");
  }
  
  const cleanPath = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  return `${API_BASE}${cleanPath}`;
};

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

export const resolveCategoryInfo = (categoryId, productName = '') => {
  if (!categoryId) return resolveFromTitle(productName);
  
  if (typeof categoryId === 'object') {
    const name = categoryId.name || categoryId.title || '';
    const slug = categoryId.slug || '';
    if (name && !/^[0-9a-fA-F]{24}$/.test(name)) {
      return { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-') };
    }
    if (categoryId._id && DB_CATEGORY_MAP[categoryId._id]) return DB_CATEGORY_MAP[categoryId._id];
    if (categoryId.id && DB_CATEGORY_MAP[categoryId.id]) return DB_CATEGORY_MAP[categoryId.id];
  }

  if (typeof categoryId === 'string') {
    if (DB_CATEGORY_MAP[categoryId]) return DB_CATEGORY_MAP[categoryId];
    
    // Check localStorage cache
    try {
      const cached = localStorage.getItem("luxury_categories");
      if (cached) {
        const categories = JSON.parse(cached);
        const found = categories.find(c => c._id === categoryId || c.id === categoryId);
        if (found && found.name) {
          return { name: found.name, slug: found.slug || found.name.toLowerCase().replace(/\s+/g, '-') };
        }
      }
    } catch (_) {}

    // If it's not a 24-char hex ID, it's already a category name or slug
    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return { name: categoryId, slug: categoryId.toLowerCase().replace(/\s+/g, '-') };
    }
  }

  return resolveFromTitle(productName);
};

export const resolveCategoryName = (categoryId, productName = '') => {
  return resolveCategoryInfo(categoryId, productName).name;
};

export const mapRemoteProduct = (product = {}) => {
  let rawImage = product.imageUrl || product.image || "";
  if (!rawImage && Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    rawImage = typeof firstImg === "object" ? firstImg.url : firstImg;
  }

  const galleryImages = Array.isArray(product.images)
    ? product.images.map((img) => typeof img === "object" ? normalizeProductImage(img.url) : normalizeProductImage(img)).filter(Boolean)
    : [];

  let variations = [];
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    variations = product.variants.map((v, idx) => {
      const vPrice = Number(v.price || 0);
      const vOffer = v.offerPrice !== undefined && v.offerPrice !== null && v.offerPrice !== "" ? Number(v.offerPrice) : null;
      const hasOffer = vOffer !== null && vOffer > 0 && vOffer < vPrice;
      
      return {
        id: v._id || v.id || `var-${idx}`,
        name: `${product.name || product.title || ""} - ${v.size}`,
        size: v.size || "Standard",
        price: hasOffer ? vOffer : vPrice,
        originalPrice: hasOffer ? vPrice : null,
        regularPrice: vPrice,
        offerPrice: vOffer,
        sku: v.sku || "",
        sortOrder: v.sortOrder || 0,
        imageUrl: v.imageUrl ? normalizeProductImage(v.imageUrl) : null,
        stockQuantity: v.stockQuantity ?? product.stockAmount ?? 0,
        stockStatus: v.stockStatus || product.stockStatus || "instock",
      };
    });
  }

  const rawPrice = Number(product.price || 0);
  const rawOffer = product.offerPrice !== undefined && product.offerPrice !== null && product.offerPrice !== "" ? Number(product.offerPrice) : null;
  const hasMainOffer = rawOffer !== null && rawOffer > 0 && rawOffer < rawPrice;

  // Create default fallback variation if empty
  if (variations.length === 0) {
    variations.push({
      id: product.id || product._id || "var-default",
      name: product.name || product.title || "",
      size: "Standard",
      price: hasMainOffer ? rawOffer : rawPrice,
      originalPrice: hasMainOffer ? rawPrice : null,
      regularPrice: rawPrice,
      offerPrice: rawOffer,
      sku: product.sku || "",
      sortOrder: 0,
      imageUrl: null,
      stockQuantity: product.stockAmount ?? 0,
      stockStatus: product.stockStatus || "instock",
    });
  }

  const activePrice = hasMainOffer 
    ? rawOffer 
    : (rawPrice > 0 ? rawPrice : (variations.length > 0 ? Math.min(...variations.map((v) => v.price)) : 0));

  const origPrice = hasMainOffer ? rawPrice : null;

  const catVal = product._populatedCategories?.[0] || product.category || (Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0] : "");
  const catInfo = resolveCategoryInfo(catVal, product.name || product.title);

  return {
    id: product.id || product._id || product.slug || String(Math.random()),
    did: product.did || "",
    name: product.name || product.title || "",
    slug: product.slug || "",
    type: product.type || (variations.length > 1 ? "variant" : "simple"),
    description: product.description || "",
    longDescription: product.longDescription || "",
    category: catInfo.name,
    categorySlug: catInfo.slug,
    price: activePrice,
    originalPrice: origPrice,
    regularPrice: rawPrice,
    offerPrice: rawOffer,
    basePrice: activePrice,
    sku: product.sku || (variations[0]?.sku) || "",
    season: product.season || "All-Season",
    tags: Array.isArray(product.tags) ? product.tags : [],
    notes: Array.isArray(product.notes) ? product.notes : [],
    stockStatus: product.stockStatus || "instock",
    stockAmount: product.stockAmount ?? 0,
    chargeTax: Boolean(product.chargeTax),
    taxRate: product.taxRate || null,
    metaData: product.metaData || null,
    image: normalizeProductImage(rawImage),
    images: galleryImages.length > 0 ? galleryImages : [normalizeProductImage(rawImage)],
    sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : variations.map(v => v.size),
    variants: variations,
    raw: product,
  };
};
