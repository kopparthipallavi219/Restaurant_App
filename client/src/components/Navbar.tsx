'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  MapPin,
  PhoneCall,
  Menu as MenuIcon,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItemCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Explore Menu' },
    { href: '/outlets', label: 'Outlets' },
    { href: '/reservations', label: 'Book Table' },
    { href: '/catering', label: 'Catering & Parties' },
    { href: '/user', label: 'User Portal' },
    { href: '/about', label: 'Our Story' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-mehfil-burgundy-light via-mehfil-burgundy-accent to-mehfil-burgundy-light border-b border-mehfil-saffron/20 text-xs py-1.5 pl-28 sm:pl-36 md:pl-4 pr-4 text-center text-mehfil-parchment flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-mehfil-gold font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-mehfil-saffron" />
          <strong className="text-mehfil-saffron font-serif text-sm tracking-wide">"Come, Make it a Mehfil"</strong>
        </span>
        <span className="hidden md:inline text-mehfil-gold">•</span>
        <span className="hidden md:inline text-mehfil-parchment-muted">
          Order Online or Hotline: <strong className="text-mehfil-saffron">+91 40 2475 6677</strong>
        </span>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-mehfil-burgundy-dark/90 backdrop-blur-md border-b border-mehfil-burgundy-border/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-mehfil-saffron via-mehfil-saffron-dark to-mehfil-burgundy-accent flex items-center justify-center shadow-nizami border border-mehfil-gold/40 group-hover:scale-105 transition-transform duration-300">
                <UtensilsCrossed className="w-6 h-6 text-mehfil-burgundy-dark" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wide text-saffron-gradient block leading-none">
                  MEHFIL
                </span>
                <span className="text-[11px] font-serif italic text-mehfil-gold font-normal tracking-wide block mt-1">
                  "Come, Make it a Mehfil"
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-mehfil-saffron/15 text-mehfil-saffron border border-mehfil-saffron/30 font-semibold shadow-sm'
                      : 'text-mehfil-parchment-muted hover:text-mehfil-parchment hover:bg-mehfil-burgundy-light/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/reservations"
                className="hidden xl:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-mehfil-gold bg-mehfil-burgundy-light border border-mehfil-gold/30 hover:border-mehfil-gold hover:bg-mehfil-burgundy-accent transition-all duration-200"
              >
                <Calendar className="w-4 h-4 text-mehfil-gold" />
                Reserve Table
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark font-bold text-xs uppercase tracking-wider shadow-nizami hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
                {totalItemCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-mehfil-burgundy-dark text-mehfil-gold font-extrabold text-[11px] flex items-center justify-center border border-mehfil-gold/40">
                    {totalItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu & Cart Controls */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 rounded-xl bg-mehfil-burgundy-light border border-mehfil-saffron/30 text-mehfil-saffron"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-mehfil-saffron text-mehfil-burgundy-dark font-extrabold text-[10px] flex items-center justify-center border border-mehfil-burgundy-dark">
                    {totalItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-mehfil-burgundy-light text-mehfil-parchment border border-mehfil-burgundy-border"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-mehfil-saffron" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-mehfil-burgundy-dark/95 backdrop-blur-xl flex flex-col justify-between p-6 animate-in fade-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between border-b border-mehfil-burgundy-border/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mehfil-saffron flex items-center justify-center text-mehfil-burgundy-dark font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-saffron-gradient">
                MEHFIL
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-mehfil-burgundy-light text-mehfil-parchment border border-mehfil-burgundy-border"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-2 my-auto py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3.5 rounded-xl text-base font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-mehfil-saffron text-mehfil-burgundy-dark'
                    : 'text-mehfil-parchment hover:bg-mehfil-burgundy-light'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-5 h-5 opacity-70" />
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-mehfil-burgundy-border/60">
            <Link
              href="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-mehfil-burgundy-light border border-mehfil-gold/40 text-mehfil-gold font-bold text-sm uppercase tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              Reserve a Table
            </Link>

            <Link
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-mehfil-saffron text-mehfil-burgundy-dark font-bold text-sm uppercase tracking-wider shadow-nizami"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Online Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
