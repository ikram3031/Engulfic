'use client';

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useProductDetails, useProducts, useSizeChartByCategory } from '@/hooks/useProducts';
import { ProductDetailsSkeleton } from '@/components/skeletons';
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

const SIZE_ALIASES = {
  'XXL': ['2XL', 'XXL', 'EXTRA EXTRA LARGE', 'XX-LARGE'],
  '2XL': ['2XL', 'XXL', 'EXTRA EXTRA LARGE', 'XX-LARGE'],
  'XXXL': ['3XL', 'XXXL', '3X-LARGE'],
  '3XL': ['3XL', 'XXXL', '3X-LARGE'],
  'XS': ['XS', 'EXTRA SMALL', 'X-SMALL'],
  'S': ['S', 'SMALL'],
  'M': ['M', 'MEDIUM', 'MED'],
  'L': ['L', 'LARGE', 'LRG'],
  'XL': ['XL', 'EXTRA LARGE', 'X-LARGE', '1XL'],
};

const STANDARD_SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '28', '30', '32', '34', '36', '38'];

// Evaluates whether a product variation size matches a size chart standard identifier
const matchesSize = (productSize, chartSize) => {
  if (!productSize || !chartSize) return false;
  const pNorm = String(productSize).trim().toUpperCase();
  const cNorm = String(chartSize).trim().toUpperCase();
  if (pNorm === cNorm) return true;

  const aliases = SIZE_ALIASES[cNorm] || [cNorm];
  return aliases.includes(pNorm);
};

// Renders product details, gallery, size selection, custom size table, and related items
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading, isError, error } = useProductDetails(id);

  const { data: relatedProducts = [] } = useProducts(
    {
      category: product?.categorySlug,
      limit: 4,
    },
    { enabled: Boolean(product?.categorySlug) }
  );

  const { data: apiSizeChart } = useSizeChartByCategory(product?.categoryDid || product?.categorySlug);

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

  const [activeImage, setActiveImage] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [sizeError, setSizeError] = useState(false);

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
      setSelectedVariant(null);
      setSelectedSize('');
      setSelectedColor(product.colors?.[0]?.name || 'Default');
      setSizeError(false);
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

  // Determines whether a specific variant is currently active
  const isVariantSelected = (v) => {
    if (!selectedSize && !selectedVariant) return false;
    if (selectedVariant) {
      const vId = v.id || v._id;
      const selId = selectedVariant.id || selectedVariant._id;
      if (vId && selId && String(vId) === String(selId)) return true;
    }
    return Boolean(
      selectedSize &&
      v.size &&
      String(selectedSize).trim().toUpperCase() === String(v.size).trim().toUpperCase()
    );
  };

  // Determines whether a specific size string is currently active
  const isSizeSelected = (s) => {
    if (!selectedSize) return false;
    return Boolean(
      s &&
      String(selectedSize).trim().toUpperCase() === String(s).trim().toUpperCase()
    );
  };

  // Selects or deselects product variant and updates active gallery image
  const handleSelectVariant = (v) => {
    setSizeError(false);
    if (isVariantSelected(v)) {
      setSelectedVariant(null);
      setSelectedSize('');
      return;
    }
    setSelectedVariant(v);
    setSelectedSize(v.size || '');
    if (v.imageUrl) {
      setActiveImage(v.imageUrl);
      const matchIdx = allImages.indexOf(v.imageUrl);
      if (matchIdx !== -1) setActiveIndex(matchIdx);
    }
  };

  // Selects or deselects product size and matches corresponding variant
  const handleSelectSize = (s) => {
    setSizeError(false);
    if (isSizeSelected(s)) {
      setSelectedSize('');
      setSelectedVariant(null);
      return;
    }
    setSelectedSize(s);
    const matchingVar = product?.variants?.find((v) => matchesSize(s, v.size));
    if (matchingVar) {
      setSelectedVariant(matchingVar);
      if (matchingVar.imageUrl) {
        setActiveImage(matchingVar.imageUrl);
        const matchIdx = allImages.indexOf(matchingVar.imageUrl);
        if (matchIdx !== -1) setActiveIndex(matchIdx);
      }
    } else {
      setSelectedVariant(null);
    }
  };

  // Switches to the previous gallery image
  const handlePrevImage = () => {
    if (allImages.length > 1) {
      const newIndex = (activeIndex - 1 + allImages.length) % allImages.length;
      setActiveIndex(newIndex);
      setActiveImage(allImages[newIndex]);
    }
  };

  // Switches to the next gallery image
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

  // Validates selection and adds the item to cart
  const handleAddToCart = () => {
    const hasSizes = (product?.variants?.length > 0) || (product?.sizes?.length > 0);
    if (hasSizes && (!selectedSize || !selectedSize.trim())) {
      setSizeError(true);
      setToastMessage('Please select a size / variant first!');
      setTimeout(() => setToastMessage(''), 3500);
      setTimeout(() => setSizeError(false), 3000);
      return;
    }
    const itemToCart = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      sku: currentSku
    };
    addToCart(itemToCart, selectedSize, selectedColor);
    setToastMessage(`Added "${product.name}" (${selectedSize}) to cart`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Validates selection, adds item to cart without opening drawer, and navigates to checkout
  const handleBuyNow = () => {
    const hasSizes = (product?.variants?.length > 0) || (product?.sizes?.length > 0);
    if (hasSizes && (!selectedSize || !selectedSize.trim())) {
      setSizeError(true);
      setToastMessage('Please select a size / variant first!');
      setTimeout(() => setToastMessage(''), 3500);
      setTimeout(() => setSizeError(false), 3000);
      return;
    }
    const itemToCart = {
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      sku: currentSku
    };
    addToCart(itemToCart, selectedSize, selectedColor, 1, false);
    useCartStore.getState().closeCart();
    navigate('/checkout');
  };

  // Toggles item in user wishlist
  const handleToggleWishlist = () => {
    toggleWishlist(product);
    setToastMessage(
      isWishlisted
        ? `Removed "${product.name}" from Wishlist`
        : `Saved "${product.name}" to Wishlist`
    );
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Returns weather icon matching seasonality tag
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
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300 overflow-x-hidden">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1 pb-16 md:pb-24">
        {isLoading || !product ? (
          <ProductDetailsSkeleton />
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
                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-[22px] sm:text-3xl font-semibold uppercase tracking-normal sm:tracking-wide font-sans leading-tight sm:leading-tight">
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

                  {/* Variant and Size Selection */}
                  {(product.variants?.length > 0 || product.sizes?.length > 0) && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-500 dark:text-white/60 uppercase tracking-wider font-bold">
                          SELECT VARIANT / SIZE:
                        </span>
                        {selectedSize ? (
                          <span className="font-bold text-white bg-orange-500 px-2.5 py-0.5 rounded-lg border border-orange-500 uppercase text-[11px] shadow-sm">
                            {selectedSize} Selected
                          </span>
                        ) : (
                          <span className={`font-medium px-2.5 py-0.5 rounded-lg border uppercase text-[11px] transition-all ${
                            sizeError
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500 animate-pulse font-bold'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/10'
                          }`}>
                            {sizeError ? 'Please select a size!' : 'None Selected'}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {product.variants?.length > 0 ? (
                          product.variants.map((v, idx) => {
                            const isSelected = isVariantSelected(v);
                            return (
                              <button
                                key={v.id || v._id || v.size || idx}
                                type="button"
                                onClick={() => handleSelectVariant(v)}
                                className={`p-3.5 rounded-2xl text-left font-mono transition-all duration-200 border-2 flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-xl ring-2 ring-orange-500/40 scale-[1.02]'
                                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/15 text-slate-800 dark:text-white/80 hover:border-slate-400 dark:hover:border-white/30'
                                } ${sizeError && !isSelected ? 'border-rose-300 dark:border-rose-900/50' : ''}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-black uppercase ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                    {v.size}
                                  </span>
                                  {isSelected && (
                                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-1.5 text-[11px]">
                                  <span className={`font-mono font-bold ${isSelected ? 'text-white' : 'text-slate-500 dark:text-white/60'}`}>
                                    {formatPrice(v.price)}
                                  </span>
                                  {v.originalPrice && v.originalPrice > v.price && (
                                    <span className={`line-through text-[10px] ${isSelected ? 'text-orange-200' : 'text-slate-400 dark:text-white/40'}`}>
                                      {formatPrice(v.originalPrice)}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          product.sizes?.map((s, idx) => {
                            const isSelected = isSizeSelected(s);
                            return (
                              <button
                                key={s || idx}
                                type="button"
                                onClick={() => handleSelectSize(s)}
                                className={`p-3.5 rounded-2xl text-center font-mono transition-all duration-200 border-2 flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-xl ring-2 ring-orange-500/40 scale-[1.02]'
                                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/15 text-slate-800 dark:text-white/80 hover:border-slate-400 dark:hover:border-white/30'
                                } ${sizeError && !isSelected ? 'border-rose-300 dark:border-rose-900/50' : ''}`}
                              >
                                <span className={`text-xs font-black uppercase ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                  {s}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                                )}
                              </button>
                            );
                          })
                        )}
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

                  {(() => {
                    const productVariantSizes = (product.variants && product.variants.length > 0)
                      ? product.variants.map((v) => v.size).filter(Boolean)
                      : (product.sizes || []);

                    if (productVariantSizes.length === 0) return null;

                    const hasDynamicChart = Boolean(
                      apiSizeChart &&
                      Array.isArray(apiSizeChart.columns) &&
                      apiSizeChart.columns.length > 0 &&
                      Array.isArray(apiSizeChart.rows) &&
                      apiSizeChart.rows.length > 0
                    );

                    if (hasDynamicChart) {
                      const columns = apiSizeChart.columns;
                      const unit = apiSizeChart.unit || 'Inches';
                      const matchedRows = [];
                      const seenSizes = new Set();

                      productVariantSizes.forEach((pSize) => {
                        const pSizeTrimmed = String(pSize).trim();
                        const pSizeUpper = pSizeTrimmed.toUpperCase();
                        if (seenSizes.has(pSizeUpper)) return;
                        seenSizes.add(pSizeUpper);

                        const foundRow = apiSizeChart.rows.find((r) => matchesSize(pSizeTrimmed, r.size));
                        const matchingVariant = product.variants?.find((v) => matchesSize(pSizeTrimmed, v.size)) || null;

                        if (foundRow) {
                          matchedRows.push({
                            size: foundRow.size || pSizeTrimmed,
                            displaySize: pSizeTrimmed,
                            values: foundRow.values || {},
                            variant: matchingVariant,
                          });
                        } else {
                          matchedRows.push({
                            size: pSizeTrimmed,
                            displaySize: pSizeTrimmed,
                            values: {},
                            variant: matchingVariant,
                          });
                        }
                      });

                      matchedRows.sort((a, b) => {
                        const idxA = STANDARD_SIZE_ORDER.indexOf(a.displaySize.toUpperCase());
                        const idxB = STANDARD_SIZE_ORDER.indexOf(b.displaySize.toUpperCase());
                        const valA = idxA !== -1 ? idxA : 999;
                        const valB = idxB !== -1 ? idxB : 999;
                        return valA - valB;
                      });

                      if (matchedRows.length === 0) return null;

                      return (
                        <div className="p-4 sm:p-5 bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3 shadow-sm transition-colors duration-300">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-orange-500" />
                              <h3 className="text-xs font-bold font-mono uppercase text-slate-900 dark:text-white flex items-center gap-2">
                                <span>Size Chart</span>
                                <span className="text-[10px] font-normal text-slate-500 dark:text-white/50 tracking-normal">
                                  ({matchedRows.length} Available {matchedRows.length === 1 ? 'Variation' : 'Variations'})
                                </span>
                              </h3>
                            </div>
                            <span className="text-[10px] font-mono text-orange-500 font-bold tracking-wider">{unit}</span>
                          </div>

                          <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left font-mono text-[11px] whitespace-nowrap">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 uppercase text-[10px]">
                                  <th className="py-2.5 px-3">Size</th>
                                  {columns.map((col, cIdx) => (
                                    <th key={cIdx} className="py-2.5 px-3">{col}</th>
                                  ))}
                                  <th className="py-2.5 px-3 text-right">Variation</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                                {matchedRows.map((row, idx) => {
                                  const isSelected = isSizeSelected(row.displaySize);
                                  return (
                                    <tr
                                      key={idx}
                                      onClick={() => {
                                        if (row.variant) {
                                          handleSelectVariant(row.variant);
                                        } else {
                                          handleSelectSize(row.displaySize);
                                        }
                                      }}
                                      className={`cursor-pointer transition-all duration-200 ${
                                        isSelected
                                          ? 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold border-l-4 border-orange-500 shadow-sm'
                                          : 'hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-700 dark:text-white/80'
                                      }`}
                                    >
                                      <td className="py-3 px-3.5 font-bold flex items-center gap-1.5">
                                        <span className={isSelected ? 'text-orange-600 dark:text-orange-400 font-black' : 'text-slate-900 dark:text-white'}>
                                          {row.displaySize}
                                        </span>
                                        {isSelected && (
                                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                        )}
                                      </td>
                                      {columns.map((col, cIdx) => {
                                        const val = row.values?.[col] ?? row.values?.[col.toLowerCase()] ?? row.values?.[col.toUpperCase()] ?? row[col] ?? '-';
                                        return (
                                          <td key={cIdx} className="py-3 px-3.5">
                                            {val}
                                          </td>
                                        );
                                      })}
                                      <td className="py-3 px-3.5 text-right">
                                        {isSelected ? (
                                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500 text-white uppercase tracking-wider shadow-sm">
                                            Selected <CheckCircle2 className="w-3 h-3 text-white" />
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 group-hover:text-orange-500">
                                            Select
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })()}

                </div>
              </div>
            </div>

            {/* Long Description Section */}
            {product.longDescription && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-10 border-t border-slate-200 dark:border-white/10 space-y-4">
                <h2 className="text-[20px] sm:text-2xl font-black uppercase tracking-wide flex items-center gap-2 whitespace-nowrap">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
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
                  MORE FROM {product.category ? product.category.toUpperCase() : 'THE COLLECTION'}
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
};

export default ProductDetailPage;
