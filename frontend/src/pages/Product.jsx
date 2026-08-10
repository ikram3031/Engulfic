'use client';

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, fetchProducts } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
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
  ArrowRight
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['products', 'latest'],
    queryFn: () => fetchProducts({ limit: 4 })
  });

  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedSize(product.sizes?.[0] || (product.variants?.[0]?.name) || 'M');
      setSelectedColor(product.colors?.[0]?.name || 'Default');
    }
  }, [product]);
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor);
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

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {isLoading || !product ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Clickable Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: product.category, href: `/category/${product.categorySlug || product.category.toLowerCase().replace(/\s+/g, '-')}` },
            { label: product.name }
          ]}
        />

        {/* Product Details Main Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Image Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-slate-200 dark:bg-black/40 border border-slate-200 dark:border-white/10 shadow-2xl">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                {product.isNew && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-lg border border-orange-400/30">
                    NEW RUNWAY
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveImage(product.image)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition ${
                    activeImage === product.image ? 'border-orange-500 scale-105 shadow-lg' : 'border-slate-300 dark:border-white/10 opacity-70'
                  }`}
                >
                  <img src={product.image} alt="Primary" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
                {product.secondaryImage && (
                  <button
                    onClick={() => setActiveImage(product.secondaryImage)}
                    className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition ${
                      activeImage === product.secondaryImage ? 'border-orange-500 scale-105 shadow-lg' : 'border-slate-300 dark:border-white/10 opacity-70'
                    }`}
                  >
                    <img src={product.secondaryImage} alt="Secondary" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Product Options & Purchase */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-orange-500">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{product.category}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wide">
                  {product.name}
                </h1>
                <p className="text-xs font-mono text-slate-500 dark:text-white/60">
                  {product.tagline}
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base font-mono text-slate-400 dark:text-white/40 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-orange-500" />
                      <span>{product.rating} ({product.reviewsCount} Reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500 dark:text-white/60">SELECT COLOR:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition ${
                          selectedColor === c.name
                            ? 'border-orange-500 bg-orange-500/10 font-bold text-slate-900 dark:text-white'
                            : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/60'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-400" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size/Variant Selector */}
              {(product.sizes?.length > 0 || product.variants?.length > 0) && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500 dark:text-white/60">SELECT SIZE:</span>
                    <span className="text-orange-500 underline cursor-pointer">Size Guide</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {(product.sizes?.length > 0 ? product.sizes : product.variants?.map(v => v.name) || []).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-3 rounded-xl text-xs font-mono font-bold transition border ${
                          selectedSize === s
                            ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                            : 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-800 dark:text-white hover:border-orange-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black dark:hover:bg-slate-200 transition shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Zap className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span>BUY NOW</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-orange-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-orange-600 transition shadow-xl border border-orange-400/30 flex items-center justify-center gap-2"
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

              {/* Fabric & Fit Details Box */}
              <div className="p-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-orange-500 font-bold uppercase">DESCRIPTION</span>
                  <p className="text-slate-700 dark:text-white/80 leading-relaxed font-sans text-xs">
                    {product.description}
                  </p>
                </div>
                {(product.fabric || product.fit || product.care) && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-white/10">
                    {product.fabric && (
                      <div>
                        <span className="text-slate-500 dark:text-white/50 block">FABRIC:</span>
                        <span className="text-slate-900 dark:text-white font-bold">{product.fabric}</span>
                      </div>
                    )}
                    {product.fit && (
                      <div>
                        <span className="text-slate-500 dark:text-white/50 block">FIT:</span>
                        <span className="text-slate-900 dark:text-white font-bold">{product.fit}</span>
                      </div>
                    )}
                    {product.care && (
                      <div className="col-span-2">
                        <span className="text-slate-500 dark:text-white/50 block">CARE:</span>
                        <span className="text-slate-900 dark:text-white font-bold">{product.care}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 text-center text-[10px] font-mono text-slate-500 dark:text-white/60">
                <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                  <Truck className="w-4 h-4 text-orange-500 mx-auto" />
                  <span>Global DHL Express</span>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                  <RotateCcw className="w-4 h-4 text-orange-500 mx-auto" />
                  <span>30-Day Easy Returns</span>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                  <ShieldCheck className="w-4 h-4 text-orange-500 mx-auto" />
                  <span>Authenticity Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black uppercase tracking-wide">
              MORE FROM {product.category.toUpperCase()}
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
