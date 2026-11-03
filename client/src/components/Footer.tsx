'use client';

import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, MapPin, Phone, Mail, Clock, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-mehfil-burgundy-dark border-t border-mehfil-burgundy-border/60 text-mehfil-parchment-muted pt-16 pb-8 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-mehfil-saffron/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-mehfil-burgundy-border/40">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mehfil-saffron to-mehfil-saffron-dark flex items-center justify-center shadow-nizami border border-mehfil-gold/30">
                <UtensilsCrossed className="w-5 h-5 text-mehfil-burgundy-dark" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wide text-saffron-gradient block leading-none">
                  MEHFIL RESTAURANT
                </span>
                <span className="text-[9px] font-semibold tracking-widest text-mehfil-gold/80 uppercase block mt-1">
                  Iconic Hyderabadi Culinary Institution
                </span>
              </div>
            </div>

            <p className="text-xs text-mehfil-parchment-muted leading-relaxed max-w-sm">
              Renowned for slow-cooked royal Hyderabadi Mutton Dum Biryani, charred Tandoori Kebabs, and authentic Nizami hospitality across Hyderabad, Telangana.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 text-[11px] font-medium border border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Halal Certified
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mehfil-burgundy-light text-mehfil-gold text-[11px] font-medium border border-mehfil-gold/20">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Authentic Nizami Dum
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-mehfil-gold uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/menu" className="hover:text-mehfil-saffron transition-colors">
                  Signature Biryanis Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-mehfil-saffron transition-colors">
                  Book a Dining Table
                </Link>
              </li>
              <li>
                <Link href="/outlets" className="hover:text-mehfil-saffron transition-colors">
                  Hyderabad Branch Locator
                </Link>
              </li>
              <li>
                <Link href="/catering" className="hover:text-mehfil-saffron transition-colors">
                  Weddings & Bulk Catering
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open-feedback-modal'));
                    }
                  }}
                  className="hover:text-mehfil-saffron transition-colors text-left flex items-center gap-1 text-mehfil-gold font-medium"
                >
                  <span>⭐ Share Guest Feedback</span>
                </button>
              </li>
              <li>
                <Link href="/about" className="hover:text-mehfil-saffron transition-colors">
                  Our Nizam Heritage
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-mehfil-gold/80 hover:text-mehfil-gold font-medium transition-colors">
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Outlets List */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-mehfil-gold uppercase tracking-wider">
              Hyderabad Branches
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-mehfil-saffron" />
                Narayanguda (Flagship)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-mehfil-saffron" />
                Madhapur (IT Hub)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-mehfil-saffron" />
                Manikonda Main Rd
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-mehfil-saffron" />
                Attapur PVNR Expressway
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-mehfil-saffron" />
                Kukatpally KPHB
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-mehfil-saffron" />
                Gachibowli DLF
              </li>
            </ul>
          </div>

          {/* Operating Hours & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-mehfil-gold uppercase tracking-wider">
              Operating Hours
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-mehfil-saffron mt-0.5" />
                <div>
                  <span className="block font-medium text-mehfil-parchment">All Outlets Open Daily</span>
                  <span className="text-[11px] text-mehfil-parchment-muted">11:00 AM – 11:30 PM IST</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Phone className="w-4 h-4 text-mehfil-saffron mt-0.5" />
                <div>
                  <span className="block font-medium text-mehfil-parchment">Hotline Orders</span>
                  <span className="text-[11px] text-mehfil-saffron font-bold">+91 40 2475 6677</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-Footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-mehfil-parchment-muted gap-4">
          <p>© 2026 Mehfil Restaurant. All rights reserved. Content referenced from official website.</p>
          <div className="flex items-center gap-1 text-[11px]">
            Designed & Engineered by <strong className="text-mehfil-saffron">Kopparthi Pallavi Sai Srija</strong> (MERN Cohort)
          </div>
        </div>
      </div>
    </footer>
  );
};
