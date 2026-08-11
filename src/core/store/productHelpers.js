export const normalizeProductImage = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  
  let cleanUrl = url;
  if (cleanUrl.startsWith("/content/")) {
    cleanUrl = cleanUrl.replace("/content/", "/uploads/");
  }
  
  return cleanUrl; 
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
    variations = product.variants.map((v, idx) => ({
      id: v._id || v.id || `var-${idx}`,
      name: `${product.name || product.title} - ${v.size}`,
      size: v.size || "Standard",
      price: Number(v.offerPrice || v.price || 0),
      originalPrice: v.offerPrice ? Number(v.price) : null,
      stockQuantity: v.stockQuantity ?? 0,
      stockStatus: (v.stockQuantity ?? 1) > 0 ? "instock" : "outofstock",
      sku: v.sku || "",
    }));
  }

  // Create default fallback variation if empty
  if (variations.length === 0) {
    variations.push({
      id: product.id || product._id || "var-default",
      name: product.name || product.title || "",
      size: "Full Bottle",
      price: Number(product.offerPrice || product.price || 0),
      originalPrice: product.offerPrice ? Number(product.price) : null,
      stockStatus: product.stockStatus || "instock",
    });
  }

  return {
    id: product.id || product._id || product.slug || String(Math.random()),
    name: product.name || product.title || "",
    slug: product.slug || "",
    category: resolveCategoryName(product.category),
    // brand logic omitted as requested
    basePrice: variations.length > 0 ? Math.min(...variations.map((v) => v.price)) : 0,
    image: normalizeProductImage(rawImage),
    images: galleryImages.length > 0 ? galleryImages : [normalizeProductImage(rawImage)],
    variations,
    raw: product,
  };
};
