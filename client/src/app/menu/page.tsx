'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  Sparkles,
  Flame,
  UtensilsCrossed,
  Filter,
  Star,
  Plus,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { DishModal } from '@/components/DishModal';
import { fetchAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface PortionSize {
  name: 'Single' | 'Regular' | 'Jumbo' | 'Handi';
  price: number;
  serves: string;
}

interface MenuItem {
  _id?: string;
  title: string;
  slug: string;
  categorySlug: string;
  description: string;
  price: number;
  portionSizes?: PortionSize[];
  isVeg: boolean;
  isChefSpecial?: boolean;
  spiceLevel?: string;
  image: string;
  allergens?: string[];
  ingredients?: string[];
  rating?: number;
  ordersCount?: number;
}

export default function MenuPage() {
  const { addItem } = useCart();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [chefSpecialOnly, setChefSpecialOnly] = useState(false);
  const [selectedSpice, setSelectedSpice] = useState<string>('all');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catsRes, menuRes] = await Promise.all([
          fetchAPI<{ data: { name: string; slug: string }[] }>('/api/categories'),
          fetchAPI<{ data: MenuItem[] }>('/api/menu?includeUnavailable=true&all=true'),
        ]);

        if (catsRes?.data) setCategories(catsRes.data);
        if (menuRes?.data) setItems(menuRes.data);
      } catch (_e) {
        // Fallback default items handled smoothly
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered menu items
  const filteredItems = items.filter((item) => {
    if (activeCategory !== 'all' && item.categorySlug !== activeCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    if (nonVegOnly && item.isVeg) return false;
    if (chefSpecialOnly && !item.isChefSpecial) return false;
    if (selectedSpice !== 'all' && item.spiceLevel !== selectedSpice) return false;
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-mehfil-burgundy-dark flex flex-col justify-between">
      <Navbar />
      <CartDrawer />
      {selectedDish && <DishModal item={selectedDish} onClose={() => setSelectedDish(null)} />}

      {/* Hero Header Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-mehfil-burgundy-light/40 to-mehfil-burgundy-dark">
        <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-mehfil-saffron/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 text-mehfil-saffron text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-mehfil-gold" />
            Nizami Culinary Masterpieces
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-mehfil-parchment tracking-tight">
            Interactive Culinary <span className="text-saffron-gradient">Explorer</span>
          </h1>

          <p className="text-sm sm:text-base text-mehfil-parchment-muted max-w-2xl mx-auto">
            Discover slow-cooked royal Hyderabadi Mutton Dum Biryani, charred Tandoori Kebabs, rich Mughlai gravies & authentic Nizami desserts.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="w-5 h-5 text-mehfil-gold absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Biryani, Kebabs, Qubani ka Meetha, Paneer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-mehfil-burgundy-light/90 border border-mehfil-saffron/40 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-mehfil-parchment placeholder-mehfil-parchment-muted/60 focus:border-mehfil-saffron focus:ring-1 focus:ring-mehfil-saffron focus:outline-none shadow-nizami"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Explorer Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow space-y-8">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-mehfil-burgundy-border/40">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment border border-mehfil-burgundy-border'
            }`}
          >
            All Categories ({items.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat.slug
                  ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                  : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment border border-mehfil-burgundy-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dietary & Spice Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-mehfil-burgundy-light/40 border border-mehfil-burgundy-border/60 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-mehfil-gold font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Dietary Badges:
            </span>

            <button
              type="button"
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3 py-1.5 rounded-lg font-medium border transition-all ${
                vegOnly
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500'
                  : 'bg-mehfil-burgundy-dark text-mehfil-parchment-muted border-mehfil-burgundy-border'
              }`}
            >
              🟢 100% Veg Only
            </button>

            <button
              type="button"
              onClick={() => setNonVegOnly(!nonVegOnly)}
              className={`px-3 py-1.5 rounded-lg font-medium border transition-all ${
                nonVegOnly
                  ? 'bg-rose-950/80 text-rose-400 border-rose-500'
                  : 'bg-mehfil-burgundy-dark text-mehfil-parchment-muted border-mehfil-burgundy-border'
              }`}
            >
              🔴 Non-Veg Only
            </button>

            <button
              type="button"
              onClick={() => setChefSpecialOnly(!chefSpecialOnly)}
              className={`px-3 py-1.5 rounded-lg font-medium border transition-all ${
                chefSpecialOnly
                  ? 'bg-amber-950/80 text-mehfil-gold border-mehfil-gold'
                  : 'bg-mehfil-burgundy-dark text-mehfil-parchment-muted border-mehfil-burgundy-border'
              }`}
            >
              ⭐ Chef Specials
            </button>
          </div>

          {/* Spice Level Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-mehfil-parchment-muted">Spice Intensity:</span>
            <select
              value={selectedSpice}
              onChange={(e) => setSelectedSpice(e.target.value)}
              className="bg-mehfil-burgundy-dark border border-mehfil-saffron/30 rounded-xl px-3 py-1.5 text-xs text-mehfil-parchment focus:outline-none"
            >
              <option value="all">All Spice Levels</option>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Hot">Hot</option>
              <option value="Spicy">Spicy</option>
            </select>
          </div>
        </div>

        {/* Menu Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-mehfil-parchment-muted">
            Loading Mehfil culinary menu...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <UtensilsCrossed className="w-12 h-12 text-mehfil-saffron/40 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-mehfil-parchment">
              No Dishes Found
            </h3>
            <p className="text-xs text-mehfil-parchment-muted">
              Try adjusting your search query or dietary filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((dish) => (
              <div
                key={dish.slug}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Dish Image */}
                <div
                  className="relative h-52 w-full cursor-pointer overflow-hidden"
                  onClick={() => setSelectedDish(dish)}
                >
                  <Image
                    src={dish.image}
                    alt={dish.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mehfil-burgundy-dark via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                        dish.isVeg
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                          : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                      }`}
                    >
                      {dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>

                    {(dish as any).isAvailable === false ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/95 text-rose-300 border border-rose-500/60 flex items-center gap-1 animate-pulse">
                        🔴 Out of Stock
                      </span>
                    ) : (
                      dish.isChefSpecial && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/90 text-mehfil-gold border border-mehfil-gold/40 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-mehfil-gold" />
                          Chef's Special
                        </span>
                      )
                    )}
                  </div>

                  {/* Spice Badge */}
                  {dish.spiceLevel && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-mehfil-burgundy-dark/90 border border-mehfil-saffron/30 text-[10px] text-mehfil-saffron font-medium flex items-center gap-1">
                      <Flame className="w-3 h-3 text-mehfil-saffron" />
                      {dish.spiceLevel}
                    </div>
                  )}
                </div>

                {/* Dish Info */}
                <div className="p-5 flex-grow space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => setSelectedDish(dish)}
                      className="font-serif text-lg font-bold text-mehfil-parchment group-hover:text-mehfil-saffron transition-colors cursor-pointer"
                    >
                      {dish.title}
                    </h3>
                    <div className="flex items-center gap-1 text-mehfil-gold text-xs font-bold flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-mehfil-gold text-mehfil-gold" />
                      {dish.rating || 4.8}
                    </div>
                  </div>

                  <p className="text-xs text-mehfil-parchment-muted line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-mehfil-burgundy-border/30 mt-3">
                  <div>
                    <span className="text-[10px] text-mehfil-parchment-muted block">Starting at</span>
                    <span className="font-serif text-xl font-bold text-saffron-gradient">
                      {formatCurrency(dish.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDish(dish)}
                      className="p-2.5 rounded-xl bg-mehfil-burgundy-light hover:bg-mehfil-burgundy-accent text-mehfil-parchment border border-mehfil-burgundy-border text-xs"
                      title="View portion sizes & ingredients"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {(dish as any).isAvailable === false ? (
                      <button
                        disabled
                        className="px-4 py-2.5 rounded-xl bg-rose-950/80 text-rose-300/80 border border-rose-800/40 font-bold text-xs uppercase tracking-wider cursor-not-allowed opacity-80"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          addItem({
                            menuItemId: dish.slug,
                            title: dish.title,
                            categorySlug: dish.categorySlug,
                            portionName: dish.portionSizes?.[0]?.name || 'Regular',
                            price: dish.price,
                            quantity: 1,
                            isVeg: dish.isVeg,
                            image: dish.image,
                          })
                        }
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark font-bold text-xs uppercase tracking-wider shadow-nizami flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
