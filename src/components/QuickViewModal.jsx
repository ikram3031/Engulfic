'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { trackViewContent } from '@/lib/metaPixel';
import { X, Star, Heart, ShoppingCart, Truck, ShieldCheck, Check, Sparkles } from 'lucide-react';

// Displays product quick view modal with variant selectors and Meta Pixel ViewContent tracking
const QuickViewModal = ({ product, onClose, onShowToast }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || product?.variants?.[0]?.size || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // details, fabric, shipping
  const [activeImage, setActiveImage] = useState(product?.image || '');

  useEffect(() => {
    if (product) {
      trackViewContent(product);
    }
  }, [product]);


  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    if (onShowToast) {
      onShowToast(
        isWishlisted ? `Removed "${product.name}" from Wishlist` : `Saved "${product.name}" to Wishlist`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#050505]/90 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-white max-h-[90vh] flex flex-col md:flex-row backdrop-blur-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white rounded-full border border-slate-200 dark:border-white/10 transition backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Gallery */}
        <div className="w-full md:w-1/2 bg-slate-50 dark:bg-white/5 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10">
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 dark:bg-black/40 relative border border-slate-300 dark:border-white/10">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {product.isNew && (
              <span className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white font-black text-[10px] uppercase tracking-wider rounded-md border border-orange-400/30">
                NEW RUNWAY
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setActiveImage(product.image)}
              className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition ${
                activeImage === product.image ? 'border-orange-500 scale-105' : 'border-slate-300 dark:border-white/10 opacity-60'
              }`}
            >
              <img src={product.image} alt="Thumbnail 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
            {product.secondaryImage && (
              <button
                onClick={() => setActiveImage(product.secondaryImage)}
                className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition ${
                  activeImage === product.secondaryImage ? 'border-orange-500 scale-105' : 'border-slate-300 dark:border-white/10 opacity-60'
                }`}
              >
                <img src={product.secondaryImage} alt="Thumbnail 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            )}
          </div>
        </div>

        {/* Right Info */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-orange-500 font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{(typeof product.category === 'object' ? (product.category?.name || '') : (product.category || '')).toUpperCase()} {product.gender ? `• ${product.gender.toUpperCase()}` : ''}</span>
            </div>

            <h2 className="text-2xl font-semibold uppercase tracking-tight text-slate-900 dark:text-white font-sans">{product.name}</h2>
            <p className="text-xs text-slate-500 dark:text-white/50 mt-1">{product.tagline}</p>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 dark:text-white/60 border-b border-slate-200 dark:border-white/10 pb-4">
              {product.rating > 0 && (
                <div className="flex items-center gap-1 text-orange-500">
                  <Star className="w-4 h-4 fill-orange-500" />
                  <span className="font-bold text-slate-900 dark:text-white">{product.rating}</span>
                  {product.reviewsCount > 0 && <span className="text-slate-400 dark:text-white/40">({product.reviewsCount} reviews)</span>}
                </div>
              )}
              {product.rating > 0 && <span className="text-slate-300 dark:text-white/20">•</span>}
              <span className="text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stockCount} available)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-base text-slate-400 dark:text-white/40 line-through font-mono">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Color Selector */}
          {product.colors?.length > 0 && (
          <div>
            <label className="block text-xs font-mono text-slate-500 dark:text-white/50 uppercase tracking-wider mb-2">
              COLOR: <span className="text-slate-900 dark:text-white font-bold">{selectedColor}</span>
            </label>
            <div className="flex items-center gap-2">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(c.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border transition ${
                    selectedColor === c.name
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full border border-slate-300 dark:border-white/20" style={{ backgroundColor: c.hex || '#000' }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Size Selector */}
          {(product.sizes?.length > 0 || product.variants?.length > 0) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-slate-500 dark:text-white/50 uppercase tracking-wider">
                {product.variants?.length > 0 ? 'VARIANT:' : 'SIZE:'} <span className="text-slate-900 dark:text-white font-bold">{selectedSize}</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants?.length > 0 ? product.variants.map((v) => (
                <button
                  key={v.size}
                  onClick={() => setSelectedSize(v.size)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                    selectedSize === v.size
                      ? 'bg-orange-500 text-white shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {v.size} {v.price ? `- ${formatPrice(v.price)}` : ''}
                </button>
              )) : product.sizes?.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                    selectedSize === s
                      ? 'bg-orange-500 text-white shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-mono font-bold text-slate-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-orange-500 text-white hover:bg-orange-600 font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl border border-orange-400/30 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart • {formatPrice(product.price * quantity)}</span>
            </button>

            <button
              onClick={handleWishlist}
              className={`p-3.5 rounded-xl border transition ${
                isWishlisted
                  ? 'bg-orange-500 text-white border-orange-400'
                  : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Accordion Tabs */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-4 text-xs font-mono uppercase border-b border-slate-200 dark:border-white/10 pb-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 transition ${activeTab === 'details' ? 'text-orange-500 border-b-2 border-orange-500 font-bold' : 'text-slate-400 dark:text-white/40'}`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`pb-2 transition ${activeTab === 'fabric' ? 'text-orange-500 border-b-2 border-orange-500 font-bold' : 'text-slate-400 dark:text-white/40'}`}
              >
                Fabric & Care
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 transition ${activeTab === 'shipping' ? 'text-orange-500 border-b-2 border-orange-500 font-bold' : 'text-slate-400 dark:text-white/40'}`}
              >
                Shipping
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-600 dark:text-white/60 leading-relaxed">
              {activeTab === 'details' && <p>{product.description}</p>}
              {activeTab === 'fabric' && (
                <div className="space-y-1">
                  {product.fabric && <p><strong className="text-slate-900 dark:text-white">Fabric:</strong> {product.fabric}</p>}
                  {product.care && <p><strong className="text-slate-900 dark:text-white">Care:</strong> {product.care}</p>}
                  {product.fit && <p><strong className="text-slate-900 dark:text-white">Fit:</strong> {product.fit}</p>}
                  {!product.fabric && !product.care && !product.fit && <p>No specific fabric and care details provided.</p>}
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-orange-500" /> Free nationwide delivery on orders over {formatPrice(2000)}.</p>
                  <p className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> 100% Pure & Authentic Products with Money Back Guarantee.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
