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

export const resolveCategoryName = (categoryId) => {
  if (!categoryId) return "";
  if (typeof categoryId === 'string' && !categoryId.match(/^[0-9a-fA-F]{24}$/)) return categoryId;
  
  try {
    const cached = localStorage.getItem("luxury_categories");
    if (cached) {
      const categories = JSON.parse(cached);
      const found = categories.find(c => c._id === categoryId || c.id === categoryId);
      if (found) return found.name || found.title;
    }
  } catch (err) {
    // Ignore cache parse errors
  }
  return categoryId;
}

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

  const catVal = product.category || (Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0] : "");

  return {
    id: product.id || product._id || product.slug || String(Math.random()),
    did: product.did || "",
    name: product.name || product.title || "",
    slug: product.slug || "",
    type: product.type || (variations.length > 1 ? "variant" : "simple"),
    description: product.description || "",
    longDescription: product.longDescription || "",
    category: resolveCategoryName(catVal),
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
