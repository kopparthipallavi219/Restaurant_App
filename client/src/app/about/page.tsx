'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, UtensilsCrossed, ShieldCheck, Flame, Award, Heart, Crown } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mehfil-burgundy-dark flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      {/* Hero Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-mehfil-burgundy-light/40 to-mehfil-burgundy-dark text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-mehfil-saffron/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 text-mehfil-saffron text-xs font-semibold uppercase tracking-wider">
            <Crown className="w-4 h-4 text-mehfil-gold" />
            Nizami Culinary Heritage & Trust
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-mehfil-parchment tracking-tight">
            The Story of <span className="text-saffron-gradient">Mehfil Restaurant</span>
          </h1>

          <p className="text-sm sm:text-base text-mehfil-parchment-muted max-w-2xl mx-auto leading-relaxed">
            An iconic Hyderabadi culinary institution built on royal recipes, uncompromising spice authenticity, and genuine hospitality.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow space-y-16">
        
        {/* Heritage Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-mehfil-parchment-muted text-sm leading-relaxed">
            <h2 className="font-serif text-3xl font-bold text-mehfil-parchment">
              Preserving Royal Flavors for Generations
            </h2>
            <p>
              In Hyderabad, Biryani is not merely a dish — it is an emotion, a tradition, and a celebration of Nizami culture. At <strong className="text-mehfil-saffron">Mehfil Restaurant</strong>, we take pride in carrying forward this rich heritage.
            </p>
            <p>
              Every dish is crafted using traditional slow-cooking <strong className="text-mehfil-gold">"Dum"</strong> techniques over wood-charcoal embers. Our master chefs hand-blend secret spice proportions passed down through generations, ensuring every grain of saffron basmati rice is infused with deep, unforgettable flavor.
            </p>
          </div>

          <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-mehfil-saffron/30 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop"
              alt="Mehfil Royal Biryani Cooking"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mehfil-burgundy-dark via-transparent to-transparent opacity-60" />
          </div>
        </div>

        {/* Pillars of Excellence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3 border border-mehfil-saffron/20">
            <div className="w-12 h-12 rounded-2xl bg-mehfil-saffron/10 border border-mehfil-saffron/20 flex items-center justify-center text-mehfil-saffron">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-mehfil-parchment">
              Wood-Charcoal Dum Cooking
            </h3>
            <p className="text-xs text-mehfil-parchment-muted leading-relaxed">
              Sealed in heavy copper handis with dough lids to lock in steam, aroma, and natural juices.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3 border border-mehfil-saffron/20">
            <div className="w-12 h-12 rounded-2xl bg-mehfil-saffron/10 border border-mehfil-saffron/20 flex items-center justify-center text-mehfil-saffron">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-mehfil-parchment">
              100% Halal & Kitchen Hygiene
            </h3>
            <p className="text-xs text-mehfil-parchment-muted leading-relaxed">
              Rigorous hygiene protocols, fresh daily meat sourcing, and zero artificial preservatives.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3 border border-mehfil-saffron/20">
            <div className="w-12 h-12 rounded-2xl bg-mehfil-saffron/10 border border-mehfil-saffron/20 flex items-center justify-center text-mehfil-saffron">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-mehfil-parchment">
              6 Flagship Locations
            </h3>
            <p className="text-xs text-mehfil-parchment-muted leading-relaxed">
              Serving thousands of satisfied diners daily in Narayanguda, Madhapur, Manikonda, Attapur, Kukatpally & Gachibowli.
            </p>
          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
}
