'use client';

import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ol className="flex items-center flex-wrap gap-2 text-xs font-mono text-slate-500 dark:text-white/50">
        <li>
          <Link to="/"
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors py-1"
          >
            <Home className="w-3.5 h-3.5 text-orange-500" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-white/30 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors py-1"
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
