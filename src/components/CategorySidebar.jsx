'use client';

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import menuData from '@/lib/menu.json';
import {
  ChevronDown,
  Sparkles,
  Layers,
  Check,
  X,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

export default function CategorySidebar({
  activeSlug = '',
  isMobileOpen = false,
  onCloseMobile = () => {},
  showAllOption = true
}) {
  const { pathname } = useLocation();

  // Keep track of expanded parent categories (default all expanded)
  const [expandedParents, setExpandedParents] = useState(() => {
    const initial = {};
    menuData.forEach((cat) => {
      initial[cat.slug] = true;
    });
    return initial;
  });

  const toggleParent = (slug) => {
    setExpandedParents((prev) => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  const isSelected = (slug) => {
    if (!slug) return false;
    return activeSlug === slug || pathname.includes(`/category/${slug}`);
  };

  const SidebarContent = (
    <div className="space-y-6 text-slate-900 dark:text-white font-mono">
      {/* Header Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>CATEGORIES</span>
        </div>
        {showAllOption && (
          <Link
            to="/shop"
            onClick={onCloseMobile}
            className={`text-[11px] font-bold uppercase transition px-2.5 py-1 rounded-full border ${
              !activeSlug || activeSlug === 'all' || pathname === '/shop' || pathname === '/catalog'
                ? 'bg-orange-500 text-white border-orange-400'
                : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white border-slate-300 dark:border-white/10'
            }`}
          >
            All Products
          </Link>
        )}
      </div>

      {/* Parent Categories Accordion List */}
      <div className="space-y-4 text-xs">
        {menuData.map((parentCat) => {
          const isParentExpanded = expandedParents[parentCat.slug] !== false;
          const parentActive = isSelected(parentCat.slug);

          return (
            <div
              key={parentCat.slug}
              className="bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all shadow-sm"
            >
              {/* Parent Category Header Bar */}
              <div className="flex items-center justify-between p-3.5 hover:bg-slate-200/60 dark:hover:bg-white/10 transition">
                <Link
                  to={`/category/${parentCat.slug}`}
                  onClick={onCloseMobile}
                  className={`flex-1 font-extrabold uppercase tracking-wider flex items-center justify-between pr-2 transition-colors ${
                    parentActive ? 'text-orange-500 font-black' : 'text-slate-800 dark:text-zinc-200 hover:text-orange-500'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-orange-500" />
                    <span>{parentCat.name}</span>
                  </span>
                  {parentActive && <Check className="w-3.5 h-3.5 text-orange-500" />}
                </Link>

                {parentCat.subcategories && parentCat.subcategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleParent(parentCat.slug)}
                    className="p-1 text-slate-400 dark:text-zinc-400 hover:text-orange-500 transition focus:outline-none"
                    aria-label="Toggle subcategories"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isParentExpanded ? 'rotate-180 text-orange-500' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Subcategories Collapsible List */}
              {isParentExpanded && parentCat.subcategories && parentCat.subcategories.length > 0 && (
                <div className="px-4 pb-3.5 pt-1 space-y-1.5 border-t border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[11px]">
                  {parentCat.subcategories.map((sub) => {
                    const subActive = isSelected(sub.slug);

                    return (
                      <Link
                        key={sub.slug}
                        to={`/category/${sub.slug}`}
                        onClick={onCloseMobile}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-all ${
                          subActive
                            ? 'bg-orange-500 text-white font-bold shadow-md'
                            : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="text-orange-500 font-bold">•</span>
                          <span>{sub.name}</span>
                        </span>
                        {subActive && <Check className="w-3 h-3 text-white" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR VIEW (lg:block) */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 p-6 bg-slate-100/90 dark:bg-zinc-950/90 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
          {SidebarContent}
        </div>
      </aside>

      {/* MOBILE DRAWER / OVERLAY VIEW (lg:hidden) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={onCloseMobile}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-zinc-950 h-full p-6 shadow-2xl overflow-y-auto z-10 flex flex-col justify-between animate-slideInRight border-l border-slate-200 dark:border-white/10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-xs font-mono font-extrabold uppercase text-orange-500 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>FILTER BY CATEGORY</span>
                </span>
                <button
                  onClick={onCloseMobile}
                  className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:text-orange-500 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {SidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
