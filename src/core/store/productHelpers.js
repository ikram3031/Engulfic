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

export const resolveCategoryInfo = (categoryId, productName = '', categoriesList = []) => {
  if (!categoryId) return resolveFromTitle(productName);
  
  if (typeof categoryId === 'object') {
    const name = categoryId.name || categoryId.title || '';
    const slug = categoryId.slug || '';
    if (name && !/^[0-9a-fA-F]{24}$/.test(name)) {
      return { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-') };
    }
  }

  // Check passed categories list or localStorage cache dynamically
  let pool = Array.isArray(categoriesList) && categoriesList.length > 0 ? categoriesList : [];
  if (pool.length === 0) {
    try {
      const cached = localStorage.getItem("luxury_categories");
      if (cached) {
        pool = JSON.parse(cached);
      }
    } catch (_) {}
  }

  const targetId = typeof categoryId === 'object' ? (categoryId._id || categoryId.id || categoryId.slug) : categoryId;
  if (targetId && pool.length > 0) {
    const found = pool.find(c => String(c._id || c.id) === String(targetId) || String(c.slug) === String(targetId));
    if (found && found.name && !/^[0-9a-fA-F]{24}$/.test(found.name)) {
      return { name: found.name, slug: found.slug || found.name.toLowerCase().replace(/\s+/g, '-') };
    }
  }

  if (typeof categoryId === 'string') {
    // If it's not a 24-char hex ID, it's already a clean category name or slug
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
