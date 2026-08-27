import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';
import SearchModal from '@/components/SearchModal';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { ProductGridSkeleton } from '@/components/skeletons';
import { Sparkles, ArrowUpDown } from 'lucide-react';

// Local category asset fallbacks
import tShirtImg from '@/assets/T-shirt.webp';
import sweatshirtImg from '@/assets/sweatshirt.webp';
import pantImg from '@/assets/pant.webp';
import shirtImg from '@/assets/shirt.webp';

const CATEGORY_STATIC_META = {
  'drop-shoulder-t-shirts': {
    name: 'T-Shirts',
    description: 'Heavyweight oversized drop shoulder tees in 300GSM organic cotton.',
    image: tShirtImg,
  },
  'drop-shoulder-tee': {
    name: 'Drop Shoulder Tee',
    description: 'Minimalist drop shoulder t-shirts in heavyweight cotton.',
    image: tShirtImg,
  },
  'graphic-drop-shoulder-tee': {
    name: 'Graphic Drop Shoulder Tee',
    description: 'Signature graphic print drop shoulder tees with high-density artwork.',
    image: tShirtImg,
  },
  't-shirt': {
    name: 'T-Shirts',
    description: 'Heavyweight oversized drop shoulder tees in 300GSM organic cotton.',
    image: tShirtImg,
  },
  'sweatshirts': {
    name: 'Sweatshirts',
    description: 'Relaxed fit architectural silhouettes in premium French terry.',
    image: sweatshirtImg,
  },
  'oversized-sweatshirt': {
    name: 'Oversized Sweatshirt',
    description: 'Relaxed fit architectural sweatshirts in premium French terry.',
    image: sweatshirtImg,
  },
  'oversized-graphic-sweatshirt': {
    name: 'Graphic Sweatshirt',
    description: 'Bold oversized graphic sweatshirts crafted from premium cotton fleece.',
    image: sweatshirtImg,
  },
  'crewneck-sweatshirt': {
    name: 'Crewneck Sweatshirt',
    description: 'Classic crewneck silhouettes with drop shoulder cut.',
    image: sweatshirtImg,
  },
  'baggy-pants': {
    name: 'Pants',
    description: 'Signature baggy cut trousers and sweatpants with tailored drape and comfort.',
    image: pantImg,
  },
  'baggy-sweatpants': {
    name: 'Baggy Sweatpants',
    description: 'Signature heavyweight French terry baggy sweatpants with deep pocket structure.',
    image: pantImg,
  },
  'baggy-graphic-sweatpants': {
    name: 'Baggy Graphic Sweatpants',
    description: 'Graphic screen-printed baggy sweatpants with relaxed leg opening.',
    image: pantImg,
  },
  'pant': {
    name: 'Pants',
    description: 'Signature baggy cut trousers with tailored drape and comfort.',
    image: pantImg,
  },
  'shirts': {
    name: 'Shirts',
    description: 'Contemporary oversized and casual shirts in Italian cotton poplin.',
    image: shirtImg,
  },
  'oversized-shirt': {
    name: 'Oversized Shirt',
    description: 'Clean structured oversized silhouette shirts tailored for modern styling.',
    image: shirtImg,
  },
  'casual-shirt': {
    name: 'Casual Shirt',
    description: 'Signature button-down casual shirts in premium lightweight fabrics.',
    image: shirtImg,
  },
  'shirt': {
    name: 'Shirts',
    description: 'Contemporary oversized and casual shirts in Italian cotton poplin.',
    image: shirtImg,
  },
  'jerseys': {
    name: 'Jerseys',
    description: 'Official athletic performance garments and fan editions.',
    image: 'https://server.engulfic.com/uploads/assets/T-shirt.webp',
  },
  'sale': {
    name: 'Archive Sale',
    description: 'Exclusive seasonal markdowns on limited runway garments.',
    image: 'https://server.engulfic.com/uploads/assets/slider-1.webp',
  },
};

export default function CategoryPage() {
  const { slug } = useParams();

  const [sortBy, setSortBy] = useState('featured');
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // TanStack Query hooks
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading: isProductsLoading } = useProducts({
    category: slug,
    sortBy: sortBy === 'newest' ? 'newest' : sortBy === 'name-asc' ? 'name-asc' : 'featured',
  });

  // Client-side exact filter & sorting for instant responsive UI
  const displayProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];
    
    // Strict exact match filter for category to fix backend fuzzy match issue
    if (slug && slug !== 'all' && slug !== 'sale') {
      list = list.filter(p => {
        // If product has a categories array, check if any exactly matches the slug
        if (p.categories && Array.isArray(p.categories) && p.categories.length > 0) {
          return p.categories.some(c => {
            const catSlug = c.slug || (c.name ? c.name.toLowerCase().replace(/\s+/g, '-') : '');
            return catSlug === slug;
          });
        }
        
        // Fallback to single category check
        const catName = (typeof p.category === 'object' ? p.category?.name : p.category) || '';
        const catSlug = p.categorySlug || catName.toLowerCase().replace(/\s+/g, '-');
        return catSlug === slug;
      });
    }

    if (sortBy === 'price-asc') {
      return list.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    if (sortBy === 'name-asc') {
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }
    return list;
  }, [products, sortBy, slug]);

  const apiCat = categories.find((c) => c.slug === slug || c._id === slug);
  const staticMeta = (slug && CATEGORY_STATIC_META[slug.toLowerCase()]) || {};

  const categoryMeta = {
    name:
      apiCat?.name ||
      staticMeta.name ||
      (slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Category'),
    description:
      apiCat?.description ||
      staticMeta.description ||
      'Explore curated high fashion garments and limited edition archive pieces.',
    image:
      apiCat?.imageUrl ||
      staticMeta.image ||
      'https://server.engulfic.com/uploads/assets/slider-2.webp',
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const breadcrumbItems = [
    { label: 'Catalog', href: '/catalog' },
    { label: categoryMeta.name, href: `/category/${slug}` }
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex-1">
        {/* Hero Category Banner */}
        <div className="relative h-[260px] sm:h-[320px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
          <img
            src={categoryMeta.image || categoryMeta.imageUrl || 'https://server.engulfic.com/uploads/assets/slider-2.webp'}
            alt={categoryMeta.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center space-y-2 sm:space-y-3 px-4 sm:px-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
              <span>COLLECTION ARCHIVE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-normal sm:tracking-tight font-sans leading-[1.2] sm:leading-tight">
              {categoryMeta.name}
            </h1>
            
            {/* Clickable Breadcrumbs inside Banner */}
            <div className="w-full max-w-sm mx-auto overflow-hidden">
              <Breadcrumb items={breadcrumbItems} isLight={true} />
            </div>

            <p className="text-[11px] sm:text-sm text-white/80 font-mono line-clamp-2 leading-relaxed max-w-lg mt-2 px-2">
              {categoryMeta.description}
            </p>
          </div>
        </div>

        {/* Filters & Sorting Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white font-bold">{displayProducts.length}</strong> {displayProducts.length === 1 ? 'product' : 'products'}
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-orange-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
              >
                <option value="featured" className="dark:bg-zinc-900">Featured</option>
                <option value="newest" className="dark:bg-zinc-900">Newest</option>
                <option value="price-asc" className="dark:bg-zinc-900">Price: Low to High</option>
                <option value="price-desc" className="dark:bg-zinc-900">Price: High to Low</option>
                <option value="name-asc" className="dark:bg-zinc-900">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isProductsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                No products found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onShowToast={showToast}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </main>
  );
}
