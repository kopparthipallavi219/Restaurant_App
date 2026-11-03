'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Clock,
  Users,
  Utensils,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  Search,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { fetchAPI } from '@/lib/api';

interface Outlet {
  branchName: string;
  slug: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  altPhone?: string;
  email?: string;
  timings: string;
  mapUrl: string;
  seatingCapacity: number;
  hasDineIn: boolean;
  hasTakeaway: boolean;
  hasDelivery: boolean;
  hasBanquet: boolean;
  image: string;
}

export default function OutletsPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOutlets() {
      try {
        setLoading(true);
        const res = await fetchAPI<{ data: Outlet[] }>('/api/outlets');
        if (res?.data) setOutlets(res.data);
      } catch (_e) {
        // Fallback default dataset handled cleanly
      } finally {
        setLoading(false);
      }
    }
    loadOutlets();
  }, []);

  const filteredOutlets = outlets.filter(
    (o) =>
      o.branchName.toLowerCase().includes(search.toLowerCase()) ||
      o.address.toLowerCase().includes(search.toLowerCase()) ||
      o.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-mehfil-burgundy-dark flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-mehfil-burgundy-light/40 to-mehfil-burgundy-dark text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-mehfil-saffron/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 text-mehfil-saffron text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-mehfil-gold" />
            Hyderabad Culinary Presence
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-mehfil-parchment tracking-tight">
            Multi-Branch <span className="text-saffron-gradient">Outlet Locator</span>
          </h1>

          <p className="text-sm sm:text-base text-mehfil-parchment-muted max-w-2xl mx-auto">
            Find your nearest Mehfil Restaurant in Narayanguda, Madhapur, Manikonda, Attapur, Kukatpally & Gachibowli.
          </p>

          {/* Branch Search Input */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <Search className="w-5 h-5 text-mehfil-gold absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by area (e.g. Narayanguda, Madhapur, Attapur)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-mehfil-burgundy-light/90 border border-mehfil-saffron/40 rounded-2xl pl-12 pr-4 py-3 text-sm text-mehfil-parchment placeholder-mehfil-parchment-muted/60 focus:border-mehfil-saffron focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Outlets Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow space-y-8">
        {loading ? (
          <div className="py-20 text-center text-mehfil-parchment-muted">
            Loading outlet branches across Hyderabad...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOutlets.map((outlet) => (
              <div
                key={outlet.slug}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between border border-mehfil-saffron/20"
              >
                {/* Branch Image Banner */}
                <div className="relative h-56 w-full">
                  <Image
                    src={outlet.image}
                    alt={outlet.branchName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mehfil-burgundy-dark via-mehfil-burgundy-dark/30 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-mehfil-parchment">
                      {outlet.branchName}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-mehfil-saffron text-mehfil-burgundy-dark uppercase tracking-wider">
                      {outlet.city}
                    </span>
                  </div>
                </div>

                {/* Branch Details */}
                <div className="p-6 space-y-4 flex-grow text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-mehfil-saffron flex-shrink-0 mt-0.5" />
                    <span className="text-mehfil-parchment-muted leading-relaxed">
                      {outlet.address}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-mehfil-burgundy-border/40">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-mehfil-gold" />
                      <span className="text-mehfil-parchment font-semibold">{outlet.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-mehfil-gold" />
                      <span className="text-mehfil-parchment-muted">{outlet.timings}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-mehfil-parchment-muted">
                    <Users className="w-4 h-4 text-mehfil-saffron" />
                    <span>Seating Capacity: <strong className="text-mehfil-parchment">{outlet.seatingCapacity} Guests</strong></span>
                  </div>

                  {/* Feature Badges */}
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    {outlet.hasDineIn && (
                      <span className="px-2.5 py-1 rounded-lg bg-mehfil-burgundy-light border border-mehfil-burgundy-border text-mehfil-parchment text-[11px]">
                        🍽️ Luxury Dine-In
                      </span>
                    )}
                    {outlet.hasTakeaway && (
                      <span className="px-2.5 py-1 rounded-lg bg-mehfil-burgundy-light border border-mehfil-burgundy-border text-mehfil-parchment text-[11px]">
                        🛍️ Takeaway Counter
                      </span>
                    )}
                    {outlet.hasBanquet && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-mehfil-gold/40 text-mehfil-gold text-[11px] font-semibold">
                        👑 Party Banquet Hall
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-0 flex items-center justify-between gap-3">
                  <a
                    href={outlet.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow py-3 px-4 rounded-2xl bg-mehfil-burgundy-light hover:bg-mehfil-burgundy-accent border border-mehfil-gold/40 text-mehfil-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Google Maps
                  </a>
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
