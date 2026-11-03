'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  UtensilsCrossed,
  Sparkles,
  ShoppingBag,
  Calendar,
  MapPin,
  Flame,
  Star,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Crown,
  ChefHat,
  Award,
  Users,
  Plus,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { DishModal } from '@/components/DishModal';
import { CartProvider, useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

// Hero Slideshow Data
const HERO_SLIDES = [
  {
    id: 'biryani',
    tag: 'Mehfil Masterpiece',
    title: 'Special Mutton Dum Biryani',
    subtitle: 'Slow-cooked over charcoal with saffron basmati rice',
    price: 390,
    ctaText: 'Order Biryani',
    slug: 'special-hyderabadi-mutton-dum-biryani',
    categorySlug: 'signature-biryanis',
    image: '/images/dishes/mutton_dum_biryani.jpg',
    isVeg: false,
  },
  {
    id: 'kebabs',
    tag: 'Charcoal Tandoor Specialty',
    title: 'Tandoori Kebabs & Starters',
    subtitle: 'Melt-in-your-mouth Murgh Malai & Chicken 65',
    price: 330,
    ctaText: 'Explore Starters',
    slug: 'tandoori-murgh-malai-kebab',
    categorySlug: 'starters-kebabs',
    image: '/images/dishes/murgh_malai_kebab.jpg',
    isVeg: false,
  },
  {
    id: 'ambiance',
    tag: 'Royal Hospitality',
    title: 'Dine-In Luxury & Banquets',
    subtitle: 'Spacious family dining across 6 flagship Hyderabad outlets',
    price: null,
    ctaText: 'Reserve Table',
    link: '/reservations',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
    isVeg: false,
  },
  {
    id: 'dessert',
    tag: 'Nizami Sweet Legacy',
    title: 'Royal Qubani Ka Meetha',
    subtitle: 'Stewed apricots with vanilla ice cream & blanched almonds',
    price: 180,
    ctaText: 'Order Dessert',
    slug: 'royal-qubani-ka-meetha',
    categorySlug: 'desserts-beverages',
    image: '/images/dishes/royal_qubani_ka_meetha.jpg',
    isVeg: true,
  },
];

// Highlighted dishes for homepage spotlight
const SPOTLIGHT_DISHES = [
  {
    title: 'Special Hyderabadi Mutton Dum Biryani',
    slug: 'special-hyderabadi-mutton-dum-biryani',
    categorySlug: 'signature-biryanis',
    description: 'Tender succulent mutton marinated overnight in saffron, green chilies, yogurt & royal Nizami spices, dum cooked over charcoal.',
    price: 390,
    isVeg: false,
    isChefSpecial: true,
    spiceLevel: 'Hot',
    image: '/images/dishes/mutton_dum_biryani.jpg',
    rating: 4.9,
  },
  {
    title: 'Hyderabadi Chicken Dum Biryani',
    slug: 'hyderabadi-chicken-dum-biryani',
    categorySlug: 'signature-biryanis',
    description: 'Iconic Mehfil signature dish. Tender chicken pieces layered with saffron basmati rice, fried onions & pure ghee dum.',
    price: 320,
    isVeg: false,
    isChefSpecial: true,
    spiceLevel: 'Medium',
    image: '/images/dishes/chicken_dum_biryani.jpg',
    rating: 4.8,
  },
  {
    title: 'Mehfil Special Chicken 65',
    slug: 'mehfil-special-chicken-65',
    categorySlug: 'starters-kebabs',
    description: 'Deep fried spicy chicken morsels tossed in red chilies, curry leaves, garlic & yogurt glaze. Legendary Hyderabadi starter.',
    price: 310,
    isVeg: false,
    isChefSpecial: true,
    spiceLevel: 'Spicy',
    image: '/images/dishes/chicken_65.jpg',
    rating: 4.9,
  },
  {
    title: 'Royal Qubani Ka Meetha with Ice Cream',
    slug: 'royal-qubani-ka-meetha',
    categorySlug: 'desserts-beverages',
    description: 'Classic Nizam dessert made from stewed apricots, garnished with blanched almonds & topped with vanilla ice cream.',
    price: 180,
    isVeg: true,
    isChefSpecial: true,
    spiceLevel: 'Mild',
    image: '/images/dishes/royal_qubani_ka_meetha.jpg',
    rating: 4.9,
  },
];

function HomeContent() {
  const { addItem } = useCart();
  const [selectedDish, setSelectedDish] = useState<any | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto advance slideshow every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-mehfil-burgundy-dark flex flex-col justify-between selection:bg-mehfil-saffron selection:text-mehfil-burgundy-dark">
      <Navbar />
      <CartDrawer />
      {selectedDish && <DishModal item={selectedDish} onClose={() => setSelectedDish(null)} />}

      {/* Open & Elegant Background Image Slideshow Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        
        {/* Background Image Slideshow with Smooth Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            priority
            className="object-cover transition-opacity duration-1000 opacity-45 brightness-90 scale-105 animate-in fade-in duration-1000"
          />
          {/* Smooth Dark Gradient Scrim ensuring text is crystal clear without needing a box */}
          <div className="absolute inset-0 bg-gradient-to-t from-mehfil-burgundy-dark via-mehfil-burgundy-dark/85 to-mehfil-burgundy-dark/70" />
        </div>

        {/* Ambient Gold Glow Effect */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-mehfil-saffron/10 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Open Hero Content Container without Box */}
        <div className="max-w-4xl mx-auto text-center relative z-10 w-full space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mehfil-burgundy-dark/90 border border-mehfil-saffron/40 text-mehfil-saffron text-xs font-semibold uppercase tracking-wider shadow-md backdrop-blur-sm">
            <Crown className="w-4 h-4 text-mehfil-gold animate-bounce" />
            Authentic Hyderabadi Culinary Institution
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-mehfil-parchment leading-tight drop-shadow-2xl">
            Royal Nizami <br className="hidden sm:inline" />
            <span className="text-saffron-gradient">Dum Biryani</span> Legacy
          </h1>

          <p className="text-sm sm:text-base text-mehfil-parchment-muted max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-lg">
            Savor the authentic taste of Hyderabad. Slow-cooked over charcoal embers with secret Nizami spices, pure ghee, and long-grain Basmati rice across 6 flagship outlets in Hyderabad.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              href="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-mehfil-saffron via-mehfil-saffron-light to-mehfil-saffron-dark text-mehfil-burgundy-dark font-extrabold text-sm uppercase tracking-wider shadow-nizami flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              Order Online Now
            </Link>

            <Link
              href="/reservations"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-mehfil-burgundy-dark/90 hover:bg-mehfil-burgundy-accent border border-mehfil-gold/40 text-mehfil-gold font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-sm transition-all duration-200"
            >
              <Calendar className="w-5 h-5 text-mehfil-gold" />
              Reserve Dining Table
            </Link>
          </div>

          {/* Quality Seals */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-mehfil-parchment-muted drop-shadow">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Halal Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-mehfil-gold" />
              <span>Fresh Daily Charcoal Dum</span>
            </div>
          </div>

        </div>

        {/* Minimal Slideshow Navigation Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-mehfil-burgundy-dark/95 px-6 py-2.5 rounded-full border border-mehfil-saffron/40 backdrop-blur-xl shadow-nizami">
          <button
            onClick={handlePrevSlide}
            className="p-1 text-mehfil-parchment hover:text-mehfil-saffron transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlideIndex === idx
                    ? 'w-8 bg-mehfil-saffron shadow-sm'
                    : 'w-2.5 bg-mehfil-parchment-muted/50 hover:bg-mehfil-gold'
                }`}
                title={slide.title}
              />
            ))}
          </div>

          <button
            onClick={handleNextSlide}
            className="p-1 text-mehfil-parchment hover:text-mehfil-saffron transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </section>

      {/* Signature Dishes Spotlight Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-mehfil-gold">
            Nizami Culinary Masterpieces
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-mehfil-parchment">
            Our Signature <span className="text-saffron-gradient">Spotlight Dishes</span>
          </h2>
          <p className="text-xs sm:text-sm text-mehfil-parchment-muted max-w-xl mx-auto">
            Crafted daily with secret Nizami spices, fresh tender meats & saffron basmati rice.
          </p>
        </div>

        {/* Dishes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPOTLIGHT_DISHES.map((dish) => (
            <div
              key={dish.slug}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group border border-mehfil-saffron/20"
            >
              <div
                className="relative h-56 w-full cursor-pointer overflow-hidden"
                onClick={() => setSelectedDish(dish)}
              >
                <Image
                  src={dish.image}
                  alt={dish.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mehfil-burgundy-dark via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      dish.isVeg
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                    }`}
                  >
                    {dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-mehfil-burgundy-dark/90 border border-mehfil-saffron/30 text-[10px] text-mehfil-saffron font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3 text-mehfil-saffron" />
                  {dish.spiceLevel}
                </div>
              </div>

              <div className="p-5 flex-grow space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <h3
                    onClick={() => setSelectedDish(dish)}
                    className="font-serif text-base font-bold text-mehfil-parchment group-hover:text-mehfil-saffron transition-colors cursor-pointer line-clamp-1"
                  >
                    {dish.title}
                  </h3>
                  <span className="flex items-center gap-1 text-mehfil-gold text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-mehfil-gold" />
                    {dish.rating}
                  </span>
                </div>

                <p className="text-xs text-mehfil-parchment-muted line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-mehfil-burgundy-border/30 mt-2">
                <span className="font-serif text-lg font-bold text-saffron-gradient">
                  {formatCurrency(dish.price)}
                </span>

                <button
                  onClick={() =>
                    addItem({
                      menuItemId: dish.slug,
                      title: dish.title,
                      categorySlug: dish.categorySlug,
                      portionName: 'Regular',
                      price: dish.price,
                      quantity: 1,
                      isVeg: dish.isVeg,
                      image: dish.image,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-mehfil-saffron text-mehfil-burgundy-dark font-bold text-xs uppercase tracking-wider shadow-nizami flex items-center gap-1 hover:scale-105 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-mehfil-burgundy-light hover:bg-mehfil-burgundy-accent border border-mehfil-gold/40 text-mehfil-gold font-bold text-xs uppercase tracking-wider transition-all"
          >
            Explore Complete Mehfil Menu ({'44 Dishes'})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Multi-Branch Outlets Preview Banner */}
      <section className="py-16 bg-mehfil-burgundy-light/40 border-y border-mehfil-burgundy-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-mehfil-gold uppercase tracking-wider">
                Convenient Dining Across Hyderabad
              </span>
              <h2 className="font-serif text-3xl font-bold text-mehfil-parchment mt-1">
                6 Flagship Outlet Branches
              </h2>
            </div>
            <Link
              href="/outlets"
              className="px-6 py-3 rounded-xl bg-mehfil-saffron text-mehfil-burgundy-dark font-bold text-xs uppercase tracking-wider shadow-nizami flex items-center gap-1.5"
            >
              View All Locations & Maps
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center text-xs">
            {['Narayanguda', 'Madhapur', 'Manikonda', 'Attapur', 'Kukatpally', 'Gachibowli'].map((branch) => (
              <div
                key={branch}
                className="p-4 rounded-2xl bg-mehfil-burgundy-dark/80 border border-mehfil-burgundy-border hover:border-mehfil-saffron/40 transition-all space-y-2"
              >
                <MapPin className="w-5 h-5 text-mehfil-saffron mx-auto" />
                <span className="font-serif font-bold text-mehfil-parchment block">
                  {branch}
                </span>
                <span className="text-[10px] text-mehfil-gold block">Dine-In & Delivery</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banquets & Event Catering Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl glass-card border border-mehfil-saffron/30 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <span className="px-3.5 py-1 rounded-full bg-amber-950/80 border border-mehfil-gold/40 text-mehfil-gold text-xs font-bold uppercase tracking-wider inline-block">
              Royal Wedding & Party Catering
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-mehfil-parchment">
              Hosting a Wedding or Large Celebration?
            </h2>
            <p className="text-xs sm:text-sm text-mehfil-parchment-muted leading-relaxed">
              We cater large-scale events with live charcoal Biryani handis, starter counters & royal Nizami desserts for 50 to 5,000+ guests.
            </p>
            <div className="pt-2">
              <Link
                href="/catering"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark font-extrabold text-xs uppercase tracking-wider shadow-nizami hover:scale-105 transition-all"
              >
                Book Event Catering Enquiry
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative w-full lg:w-96 h-64 rounded-2xl overflow-hidden border border-mehfil-saffron/30 flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"
              alt="Mehfil Banquet Catering"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
