'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export const BackNavigator: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="fixed top-1.5 left-2 sm:left-4 z-50 flex items-center gap-1 p-0.5 rounded-full bg-mehfil-burgundy-dark/90 backdrop-blur-md border border-mehfil-saffron/30 shadow-md transition-all duration-200 hover:border-mehfil-saffron group">
      <button
        onClick={handleBack}
        title="Navigate to Previous Page"
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-mehfil-parchment hover:text-mehfil-saffron hover:bg-mehfil-burgundy-light/80 active:scale-95 transition-all"
      >
        <ArrowLeft className="w-3 h-3 text-mehfil-saffron group-hover:-translate-x-0.5 transition-transform" />
        <span>Back</span>
      </button>

      <span className="w-px h-2.5 bg-mehfil-saffron/30" />

      <Link
        href="/"
        title="Navigate to Home Page"
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-all active:scale-95 ${
          pathname === '/'
            ? 'text-mehfil-burgundy-dark bg-mehfil-saffron font-extrabold shadow-sm'
            : 'text-mehfil-parchment-muted hover:text-mehfil-parchment hover:bg-mehfil-burgundy-light/80'
        }`}
      >
        <Home className="w-3 h-3 text-mehfil-gold" />
        <span>Home</span>
      </Link>
    </div>
  );
};
