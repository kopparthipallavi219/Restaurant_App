'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Flame, ShieldAlert, Sparkles, Plus, Minus, ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

interface PortionSize {
  name: 'Single' | 'Regular' | 'Jumbo' | 'Handi';
  price: number;
  serves: string;
}

interface MenuItem {
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
}

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const DishModal: React.FC<DishModalProps> = ({ item, onClose }) => {
  const { addItem } = useCart();
  const [selectedPortion, setSelectedPortion] = useState<PortionSize>(
    item?.portionSizes && item.portionSizes.length > 0
      ? item.portionSizes[0]
      : { name: 'Regular', price: item?.price || 0, serves: 'Serves 1-2' }
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) return null;

  const currentPrice = selectedPortion ? selectedPortion.price : item.price;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.slug,
      title: item.title,
      categorySlug: item.categorySlug,
      portionName: selectedPortion.name,
      price: currentPrice,
      quantity,
      isVeg: item.isVeg,
      image: item.image,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-mehfil-burgundy-dark rounded-3xl border border-mehfil-saffron/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header Banner Image */}
        <div className="relative h-64 sm:h-72 w-full">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mehfil-burgundy-dark via-mehfil-burgundy-dark/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-mehfil-burgundy-dark/80 text-mehfil-parchment hover:text-mehfil-saffron border border-mehfil-burgundy-border/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                item.isVeg
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
              }`}
            >
              {item.isVeg ? '🟢 100% Pure Veg' : '🔴 Non-Veg Specialty'}
            </span>

            {item.isChefSpecial && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-mehfil-gold border border-mehfil-gold/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-mehfil-gold" />
                Chef Special
              </span>
            )}

            {item.spiceLevel && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-mehfil-burgundy-light text-mehfil-saffron border border-mehfil-saffron/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-mehfil-saffron" />
                {item.spiceLevel}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-2xl font-bold text-mehfil-parchment">
                {item.title}
              </h2>
              <span className="font-serif text-2xl font-bold text-saffron-gradient">
                {formatCurrency(currentPrice)}
              </span>
            </div>

            <p className="mt-2 text-sm text-mehfil-parchment-muted leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Portion Size Selector */}
          {item.portionSizes && item.portionSizes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-mehfil-gold">
                Select Portion Size
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {item.portionSizes.map((portion) => (
                  <button
                    key={portion.name}
                    type="button"
                    onClick={() => setSelectedPortion(portion)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedPortion.name === portion.name
                        ? 'bg-mehfil-saffron/20 border-mehfil-saffron text-mehfil-parchment shadow-md'
                        : 'bg-mehfil-burgundy-light/60 border-mehfil-burgundy-border text-mehfil-parchment-muted hover:border-mehfil-saffron/40'
                    }`}
                  >
                    <span className="block font-serif text-sm font-bold text-mehfil-parchment">
                      {portion.name}
                    </span>
                    <span className="block text-[11px] text-mehfil-gold font-semibold mt-0.5">
                      {formatCurrency(portion.price)}
                    </span>
                    <span className="block text-[10px] text-mehfil-parchment-muted mt-1">
                      {portion.serves}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients & Allergens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-mehfil-burgundy-light/40 border border-mehfil-burgundy-border/40">
                <span className="font-semibold text-mehfil-parchment block mb-1">
                  Key Nizami Ingredients:
                </span>
                <span className="text-mehfil-parchment-muted">
                  {item.ingredients.join(', ')}
                </span>
              </div>
            )}

            {item.allergens && item.allergens.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/30">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Allergen Notice:
                </span>
                <span className="text-mehfil-parchment-muted">
                  Contains {item.allergens.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-mehfil-burgundy-border/60 bg-mehfil-burgundy-dark/95 flex items-center justify-between gap-4">
          {/* Quantity Counter */}
          <div className="flex items-center gap-3 bg-mehfil-burgundy-light p-1.5 rounded-2xl border border-mehfil-burgundy-border">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 rounded-xl text-mehfil-parchment hover:bg-mehfil-burgundy-accent transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-serif text-lg font-bold text-mehfil-parchment w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 rounded-xl text-mehfil-parchment hover:bg-mehfil-burgundy-accent transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`flex-grow py-3.5 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-nizami transition-all duration-200 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark hover:scale-[1.02] active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                Add to Order ({formatCurrency(totalPrice)})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
