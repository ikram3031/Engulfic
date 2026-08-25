'use client';

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { fetchProductDetails, fetchProducts } from '@/lib/api';
import { useAppStore } from '@/core/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { trackViewContent } from '@/lib/metaPixel';
import {
  ShoppingCart,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  Package,
  Layers,
  Percent,
  Sun,
  Snowflake,
  Leaf,
  Calendar,
  FileText,
  Check,
  Info,
  BadgeAlert,
  Ruler
} from 'lucide-react';

const SIZE_TABLE_DATA = {
  sweatshirts: {
    title: 'Sweatshirts & Oversized Crews Size Chart',
    unit: 'Inches (Chest / Length / Shoulder)',
    rows: [
      { size: 'XS', chest: '44"', length: '27"', shoulder: '21.5"' },
      { size: 'S', chest: '46"', length: '28"', shoulder: '22.5"' },
      { size: 'M', chest: '48"', length: '29"', shoulder: '23.5"' },
      { size: 'L', chest: '50"', length: '30"', shoulder: '24.5"' },
      { size: 'XL', chest: '52"', length: '31"', shoulder: '25.5"' },
    ]
  },
  pants: {
    title: 'Baggy Pants & Sweatpants Size Chart',
    unit: 'Inches (Waist / Inseam / Leg Opening)',
    rows: [
      { size: 'XS', waist: '28 - 30"', inseam: '30"', leg: '9.5"' },
      { size: 'S', waist: '30 - 32"', inseam: '31"', leg: '10.0"' },
      { size: 'M', waist: '32 - 34"', inseam: '31.5"', leg: '10.5"' },
      { size: 'L', waist: '34 - 36"', inseam: '32"', leg: '11.0"' },
      { size: 'XL', waist: '36 - 38"', inseam: '32.5"', leg: '11.5"' },
    ]
  },
  shirts: {
    title: 'Oversized & Casual Shirts Size Chart',
    unit: 'Inches (Chest / Length / Sleeve)',
    rows: [
      { size: 'XS', chest: '42"', length: '28"', sleeve: '23.5"' },
      { size: 'S', chest: '44"', length: '29"', sleeve: '24.0"' },
      { size: 'M', chest: '46"', length: '30"', sleeve: '24.5"' },
      { size: 'L', chest: '48"', length: '31"', sleeve: '25.0"' },
      { size: 'XL', chest: '50"', length: '32"', sleeve: '25.5"' },
    ]
  },
  tees: {
    title: 'Drop Shoulder T-Shirts Size Chart',
    unit: 'Inches (Chest / Length / Drop Sleeve)',
    rows: [
      { size: 'XS', chest: '44"', length: '27.5"', sleeve: '9.0"' },
      { size: 'S', chest: '46"', length: '28.5"', sleeve: '9.5"' },
      { size: 'M', chest: '48"', length: '29.5"', sleeve: '10.0"' },
      { size: 'L', chest: '50"', length: '30.5"', sleeve: '10.5"' },
      { size: 'XL', chest: '52"', length: '31.5"', sleeve: '11.0"' },
    ]
  },
  jerseys: {
    title: 'Player & Fan Edition Jerseys Size Chart',
    unit: 'Inches (Chest / Length)',
    rows: [
      { size: 'S', chest: '42"', length: '28.5"' },
      { size: 'M', chest: '44"', length: '29.5"' },
      { size: 'L', chest: '46"', length: '30.5"' },
      { size: 'XL', chest: '48"', length: '31.5"' },
    ]
  }
};

function getCategorySizeKey(product) {
  const catSlug = (product?.categorySlug || product?.category || '').toLowerCase();
  const name = (product?.name || '').toLowerCase();
  const rawCat = typeof product?.raw?.category === 'object' 
    ? (product?.raw?.category?.slug || product?.raw?.category?.name || '') 
    : String(product?.raw?.category || '');
  const combined = `${catSlug} ${name} ${rawCat}`.toLowerCase();

  // 1. Pants & Sweatpants (baggy-pants, baggy-sweatpants, baggy-graphic-sweatpants)
  if (combined.includes('pant') || combined.includes('sweatpant') || combined.includes('baggy') || combined.includes('trouser')) {
    return 'pants';
  }

  // 2. Sweatshirts & Crews (sweatshirts, oversized-sweatshirt, oversized-graphic-sweatshirt)
  if (combined.includes('sweatshirt') || combined.includes('hoodie') || combined.includes('crew')) {
    return 'sweatshirts';
  }

  // 3. Jerseys (jerseys, player-edition, fan-edition, retro-edition)
  if (combined.includes('jersey') || combined.includes('player-edition') || combined.includes('fan-edition') || combined.includes('retro-edition')) {
    return 'jerseys';
  }

  // 4. Drop Shoulder T-Shirts (drop-shoulder-t-shirts, drop-shoulder-tee, graphic-drop-shoulder-tee)
  if (combined.includes('t-shirt') || combined.includes('tee') || combined.includes('drop-shoulder')) {
    return 'tees';
  }

  // 5. Shirts (shirts, oversized-shirt, casual-shirt)
  if (combined.includes('shirt')) {
    return 'shirts';
  }

  return 'pants';
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Multi-tier product detail resolving logic: 1. API details 2. State cache 3. Full catalog search
  useEffect(() => {
    const loadProductDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetched = await fetchProductDetails(id);
        if (fetched) {
          setProduct(fetched);
          return;
        }

        const stateProducts = useAppStore.getState().products;
        if (stateProducts && stateProducts.length > 0) {
          const found = stateProducts.find(p => p.id === id || String(p.raw?.id) === String(id) || p.slug === id);
          if (found) {
            setProduct(found);
            return;
          }
        }

        const allProds = await fetchProducts({ limit: 100 });
        const found = allProds.find(p => p.id === id || String(p.raw?.id) === String(id) || p.slug === id);
        if (found) {
          setProduct(found);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to fetch details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProductDetail();
    }
  }, [id]);

  // Dynamic SEO metadata update & Meta Pixel ViewContent tracking
  useEffect(() => {
    if (product) {
      trackViewContent(product);
      document.title = product.metaData?.metaTitle || `${product.name} | Engulfic`;
      if (product.metaData?.metaDescription) {
        let metaDesc = document.querySelector("meta[name='description']");
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.name = "description";
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = product.metaData.metaDescription;
      }
    }
  }, [product]);

  // Load related products on load
  useEffect(() => {
    const loadRelated = async () => {
      try {
        const items = await fetchProducts({ limit: 4 });
        setRelatedProducts(items);
      } catch (_) {}
    };
    loadRelated();
  }, []);

  const [activeImage, setActiveImage] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  // Compute all unique gallery & main images available for this product
  const allImages = product
    ? Array.from(
        new Set(
          [
            product.image,
            ...(Array.isArray(product.galleryImages) ? product.galleryImages : []),
            ...(Array.isArray(product.images) ? product.images : []),
            ...(Array.isArray(product.variants) ? product.variants.map((v) => v.imageUrl) : [])
          ].filter((img) => typeof img === 'string' && img.trim() !== '')
        )
      )
    : [];
  
  useEffect(() => {
    if (product) {
      const defaultImg = product.image || (product.images && product.images[0]) || '';
      setActiveImage(defaultImg);
      setActiveIndex(0);
      const defaultVar = product.variants?.[0] || null;
      setSelectedVariant(defaultVar);
      setSelectedSize(defaultVar?.size || product.sizes?.[0] || 'Standard');
      setSelectedColor(product.colors?.[0]?.name || 'Default');
    }
  }, [product]);

  // Auto carousel slide effect
  useEffect(() => {
    if (allImages.length <= 1 || isAutoPlayPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % allImages.length;
        setActiveImage(allImages[next]);
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [allImages, isAutoPlayPaused]);

  const handleSelectVariant = (v) => {
    setSelectedVariant(v);
    setSelectedSize(v.size);
    if (v.imageUrl) {
      setActiveImage(v.imageUrl);
      const matchIdx = allImages.indexOf(v.imageUrl);
      if (matchIdx !== -1) setActiveIndex(matchIdx);
    }
  };

  const handlePrevImage = () => {
    if (allImages.length > 1) {
      const newIndex = (activeIndex - 1 + allImages.length) % allImages.length;
      setActiveIndex(newIndex);
      setActiveImage(allImages[newIndex]);
    }
  };

  const handleNextImage = () => {
    if (allImages.length > 1) {
      const newIndex = (activeIndex + 1) % allImages.length;
      setActiveIndex(newIndex);
      setActiveImage(allImages[newIndex]);
    }
  };

  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const currentPrice = selectedVariant ? selectedVariant.price : (product?.price || 0);
  const currentOriginalPrice = selectedVariant ? selectedVariant.originalPrice : (product?.originalPrice || null);
  const currentSku = selectedVariant?.sku || product?.sku || '';
  const currentStockStatus = selectedVariant?.stockStatus || product?.stockStatus || 'instock';
  const currentStockAmount = selectedVariant?.stockQuantity ?? product?.stockAmount ?? 0;

  const discountPercent = currentOriginalPrice && currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    const itemToCart = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      sku: currentSku
    };
    addToCart(itemToCart, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    const itemToCart = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      sku: currentSku
    };
    addToCart(itemToCart, selectedSize, selectedColor);
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    setToastMessage(
      isWishlisted
        ? `Removed "${product.name}" from Wishlist`
        : `Saved "${product.name}" to Wishlist`
    );
    setTimeout(() => setToastMessage(''), 3500);
  };

  const getSeasonIcon = (seasonName) => {
    switch (seasonName?.toLowerCase()) {
      case 'summer': return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'winter': return <Snowflake className="w-3.5 h-3.5 text-blue-400" />;
      case 'spring': return <Leaf className="w-3.5 h-3.5 text-emerald-500" />;
      case 'autumn': return <Leaf className="w-3.5 h-3.5 text-orange-500" />;
      default: return <Calendar className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1 pb-16 md:pb-24">
        {isLoading || !product ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Clickable Breadcrumbs */}
            <Breadcrumb
              items={[
                { 
                  label: product.category || 'Catalog', 
                  href: `/category/${product.categorySlug || 'all'}` 
                },
                { label: product.name }
              ]}
            />

            {/* Product Details Main Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Image Gallery / Carousel */}
                <div className="lg:col-span-6 space-y-4">
                  <div
                    onMouseEnter={() => setIsAutoPlayPaused(true)}
                    onMouseLeave={() => setIsAutoPlayPaused(false)}
                    className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-slate-200 dark:bg-black/40 border border-slate-200 dark:border-white/10 shadow-2xl group select-none"
                  >
                    <img
                      key={activeImage || activeIndex}
                      src={activeImage || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out"
                      referrerPolicy="no-referrer"
                    />

                    {discountPercent > 0 && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-lg border border-red-500/30 z-10">
                        -{discountPercent}% OFF
                      </span>
                    )}

                    {/* Carousel Controls */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-black/60 text-slate-800 dark:text-white hover:bg-white dark:hover:bg-black hover:scale-110 transition duration-300 shadow-xl opacity-80 group-hover:opacity-100 z-10"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-black/60 text-slate-800 dark:text-white hover:bg-white dark:hover:bg-black hover:scale-110 transition duration-300 shadow-xl opacity-80 group-hover:opacity-100 z-10"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Dot / Slide Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 z-10">
                          {allImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setActiveIndex(idx);
                                setActiveImage(allImages[idx]);
                              }}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                activeIndex === idx
                                  ? 'w-6 bg-orange-500'
                                  : 'w-2 bg-white/50 hover:bg-white'
                              }`}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails spanning 100% full width below main image */}
                  {allImages.length > 0 && (
                    <div className="w-full">
                      <div className="flex items-center gap-3 w-full overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
                        {allImages.map((imgUrl, index) => {
                          const isActive = activeImage === imgUrl || activeIndex === index;
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                setActiveImage(imgUrl);
                                setActiveIndex(index);
                              }}
                              className={`relative flex-1 min-w-[65px] aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                                isActive
                                  ? 'border-orange-500 ring-2 ring-orange-500/30 scale-[1.02] shadow-lg opacity-100 z-10'
                                  : 'border-slate-300 dark:border-white/10 opacity-60 hover:opacity-100 hover:border-orange-400'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Gallery thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Product Options & Purchase */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Category Badge */}
                  {product.category && (
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <Link
                        to={`/category/${product.categorySlug || product.category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="px-3 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full font-bold hover:bg-orange-500 hover:text-white transition duration-300 shadow-sm uppercase tracking-wider text-[11px]"
                      >
                        {product.category}
                      </Link>
                    </div>
                  )}

                  {/* Product Title & Identifiers (SKU) */}
                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wide">
                      {product.name}
                    </h1>

                    {/* Product SKU Metadata Bar */}
                    {currentSku && (
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-white/60">
                        <span className="bg-slate-200 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-300 dark:border-white/10">
                          SKU: <strong className="text-slate-800 dark:text-white">{currentSku}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stock Status & Stock Amount Schema Display */}
                  <div className="flex items-center gap-3">
                    {currentStockStatus === 'instock' && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-mono font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>In Stock {currentStockAmount > 0 ? `(${currentStockAmount} Available)` : ''}</span>
                      </div>
                    )}
                    {currentStockStatus === 'outofstock' && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl text-xs font-mono font-bold">
                        <BadgeAlert className="w-4 h-4 text-rose-500" />
                        <span>Out of Stock</span>
                      </div>
                    )}
                    {currentStockStatus === 'preorder' && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl text-xs font-mono font-bold">
                        <Package className="w-4 h-4 text-amber-500" />
                        <span>Pre-Order Available</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Discount Schema Section */}
                  <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                        {formatPrice(currentPrice)}
                      </span>
                      {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                        <span className="text-base font-mono text-slate-400 dark:text-white/40 line-through">
                          {formatPrice(currentOriginalPrice)}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-2.5 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow">
                          SAVE {discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Tax notice if chargeTax is enabled */}
                    {product.chargeTax && (
                      <p className="text-[11px] font-mono text-slate-500 dark:text-white/50 flex items-center gap-1">
                        <Percent className="w-3 h-3 text-orange-500" />
                        <span>{product.taxRate ? `Plus ${product.taxRate}% Tax` : 'Tax Applicable at checkout'}</span>
                      </p>
                    )}
                  </div>

                  {/* Variant Selection (Type = variant or variants schema list) */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-500 dark:text-white/60 uppercase tracking-wider font-bold">SELECT VARIANT / SIZE:</span>
                        {selectedVariant?.size && (
                          <span className="font-bold text-orange-500">{selectedVariant.size}</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {product.variants.map((v) => {
                          const isSelected = selectedVariant?.id === v.id || selectedSize === v.size;
                          return (
                            <button
                              key={v.id}
                              onClick={() => handleSelectVariant(v)}
                              className={`p-3 rounded-2xl text-left font-mono transition border flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-orange-500/10 border-orange-500 text-slate-900 dark:text-white shadow-lg'
                                  : 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-700 dark:text-white/80 hover:border-orange-500/50'
                              }`}
                            >
                              <span className="text-xs font-bold block">{v.size}</span>
                              <div className="flex items-center justify-between mt-1 text-[11px]">
                                <span className="font-mono text-orange-500">{formatPrice(v.price)}</span>
                                {v.originalPrice && v.originalPrice > v.price && (
                                  <span className="line-through text-slate-400 text-[10px]">{formatPrice(v.originalPrice)}</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleBuyNow}
                      disabled={currentStockStatus === 'outofstock'}
                      className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black dark:hover:bg-slate-200 transition shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-4 h-4 fill-orange-500 text-orange-500" />
                      <span>BUY NOW</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={handleAddToCart}
                      disabled={currentStockStatus === 'outofstock'}
                      className="flex-1 py-4 bg-orange-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-orange-600 transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </button>

                    <button
                      onClick={handleToggleWishlist}
                      className={`p-4 rounded-2xl border transition flex items-center justify-center ${
                        isWishlisted
                          ? 'bg-orange-500 text-white border-orange-400'
                          : 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-700 dark:text-white hover:border-orange-500'
                      }`}
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Descriptions: Short Description */}
                  <div className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-orange-500 font-bold uppercase flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Description</span>
                      </span>
                      <div 
                        className="text-slate-700 dark:text-white/80 leading-relaxed font-sans text-xs prose dark:prose-invert max-w-none pt-1"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </div>
                  </div>

                  {/* Tags Schema Section */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 dark:text-white/50 uppercase">TAGS:</span>
                      {product.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/70 rounded-md border border-slate-300 dark:border-white/10"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Category Wise Size Chart Table */}
                  {(() => {
                    const sizeKey = getCategorySizeKey(product);
                    const tableData = SIZE_TABLE_DATA[sizeKey];
                    if (!tableData) return null;

                    return (
                      <div className="p-5 bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-orange-500" />
                            <h3 className="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white">
                              {tableData.title}
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono text-orange-500 font-bold">{tableData.unit}</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-mono text-[11px]">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 uppercase">
                                <th className="py-2 px-2">Size</th>
                                {sizeKey === 'sweatshirts' && (
                                  <>
                                    <th className="py-2 px-2">Chest</th>
                                    <th className="py-2 px-2">Length</th>
                                    <th className="py-2 px-2">Shoulder</th>
                                  </>
                                )}
                                {sizeKey === 'pants' && (
                                  <>
                                    <th className="py-2 px-2">Waist</th>
                                    <th className="py-2 px-2">Inseam</th>
                                    <th className="py-2 px-2">Leg Opening</th>
                                  </>
                                )}
                                {sizeKey === 'shirts' && (
                                  <>
                                    <th className="py-2 px-2">Chest</th>
                                    <th className="py-2 px-2">Length</th>
                                    <th className="py-2 px-2">Sleeve</th>
                                  </>
                                )}
                                {sizeKey === 'tees' && (
                                  <>
                                    <th className="py-2 px-2">Chest</th>
                                    <th className="py-2 px-2">Length</th>
                                    <th className="py-2 px-2">Drop Sleeve</th>
                                  </>
                                )}
                                {sizeKey === 'jerseys' && (
                                  <>
                                    <th className="py-2 px-2">Chest</th>
                                    <th className="py-2 px-2">Length</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                              {tableData.rows.map((row, i) => (
                                <tr key={i} className="hover:bg-orange-500/5 transition">
                                  <td className="py-2 px-2 font-bold text-orange-500">{row.size}</td>
                                  {sizeKey === 'sweatshirts' && (
                                    <>
                                      <td className="py-2 px-2">{row.chest}</td>
                                      <td className="py-2 px-2">{row.length}</td>
                                      <td className="py-2 px-2">{row.shoulder}</td>
                                    </>
                                  )}
                                  {sizeKey === 'pants' && (
                                    <>
                                      <td className="py-2 px-2">{row.waist}</td>
                                      <td className="py-2 px-2">{row.inseam}</td>
                                      <td className="py-2 px-2">{row.leg}</td>
                                    </>
                                  )}
                                  {sizeKey === 'shirts' && (
                                    <>
                                      <td className="py-2 px-2">{row.chest}</td>
                                      <td className="py-2 px-2">{row.length}</td>
                                      <td className="py-2 px-2">{row.sleeve}</td>
                                    </>
                                  )}
                                  {sizeKey === 'tees' && (
                                    <>
                                      <td className="py-2 px-2">{row.chest}</td>
                                      <td className="py-2 px-2">{row.length}</td>
                                      <td className="py-2 px-2">{row.sleeve}</td>
                                    </>
                                  )}
                                  {sizeKey === 'jerseys' && (
                                    <>
                                      <td className="py-2 px-2">{row.chest}</td>
                                      <td className="py-2 px-2">{row.length}</td>
                                    </>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>
            </div>

            {/* Long Description Section */}
            {product.longDescription && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-10 border-t border-slate-200 dark:border-white/10 space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-wide flex items-center gap-2">
                  <Info className="w-5 h-5 text-orange-500" />
                  <span>Detailed Overview</span>
                </h2>
                <div 
                  className="text-slate-700 dark:text-zinc-300 leading-relaxed font-sans text-sm prose dark:prose-invert max-w-none pt-2"
                  dangerouslySetInnerHTML={{ __html: product.longDescription }}
                />
              </div>
            )}

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-black uppercase tracking-wide">
                  MORE FROM {(typeof product.category === 'object' ? (product.category?.name || '') : (product.category || '')).toUpperCase() || 'THE COLLECTION'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onShowToast={(msg) => setToastMessage(msg)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
