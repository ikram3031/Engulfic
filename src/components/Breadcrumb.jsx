'use client';

import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const isMongoId = (val) => typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);

export default function Breadcrumb({ items = [], isLight = false }) {
  const filteredItems = items.filter((item) => item && item.label && !isMongoId(item.label));

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={isLight ? "w-full py-1" : "py-3.5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"}
    >
      <ol className={`flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 text-xs font-sans ${
        isLight ? "text-white/70" : "text-slate-500 dark:text-white/60"
      }`}>
        <li className="inline-flex items-center">
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 transition-colors py-0.5 ${
              isLight ? "hover:text-white text-white/80" : "hover:text-orange-500 dark:hover:text-orange-400"
            }`}
          >
            <Home className={`w-3.5 h-3.5 ${isLight ? "text-white/85" : "text-orange-500"}`} />
            <span>Home</span>
          </Link>
        </li>

        {filteredItems.map((item, index) => {
          const isLast = index === filteredItems.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1.5 sm:gap-2">
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-white/40" : "text-slate-400 dark:text-white/30"}`} />
              {isLast || !item.href ? (
                <span className={`font-semibold truncate max-w-[220px] sm:max-w-md ${isLight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className={`transition-colors py-0.5 truncate max-w-[150px] sm:max-w-xs ${
                    isLight ? "hover:text-white text-white/80" : "hover:text-orange-500 dark:hover:text-orange-400"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
