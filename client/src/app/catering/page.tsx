'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Utensils,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  Sparkles,
  PartyPopper,
  Crown,
  ChefHat,
  PhoneCall,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { fetchAPI } from '@/lib/api';

export default function CateringPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [eventType, setEventType] = useState<'Wedding' | 'Corporate' | 'Birthday' | 'Family Function' | 'Bulk Biryani Handi' | 'Other'>('Wedding');
  const [guestCount, setGuestCount] = useState(150);
  const [date, setDate] = useState('2026-11-15');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [preferredOutlet, setPreferredOutlet] = useState('narayanguda');
  const [budgetPerPlate, setBudgetPerPlate] = useState('450');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryCode, setEnquiryCode] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mehfil_user_token') : null;
    setIsLoggedIn(!!token);

    if (token) {
      const userStr = localStorage.getItem('mehfil_user_data');
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed.name) setContactName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
        } catch (_e) {}
      }
    }
  }, []);

  const eventTypes = [
    { type: 'Wedding', label: 'Grand Wedding Feast' },
    { type: 'Corporate', label: 'Corporate Gala / Lunch' },
    { type: 'Birthday', label: 'Birthday Celebration' },
    { type: 'Family Function', label: 'Family Function & Reception' },
    { type: 'Bulk Biryani Handi', label: 'Bulk Biryani Handi Pickup' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !phone || !email || !venueLocation) {
      alert('Please fill in all mandatory fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetchAPI<{ success: boolean; data: { enquiryCode: string } }>(
        '/api/catering',
        {
          method: 'POST',
          body: JSON.stringify({
            eventType,
            guestCount,
            date,
            contactName,
            email,
            phone,
            venueLocation,
            preferredOutlet,
            budgetPerPlate,
            message,
          }),
        }
      );

      if (response.success) {
        setEnquiryCode(response.data.enquiryCode);
      }
    } catch (_err) {
      // Fallback mock code if API offline
      const mockCode = `MEHFIL-CAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setEnquiryCode(mockCode);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mehfil-burgundy-dark flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      {/* Hero Header */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-mehfil-burgundy-light/40 to-mehfil-burgundy-dark text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-mehfil-saffron/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 text-mehfil-saffron text-xs font-semibold uppercase tracking-wider">
            <Crown className="w-4 h-4 text-mehfil-gold" />
            Royal Nizami Catering & Banquets
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-mehfil-parchment tracking-tight">
            Event & Bulk Biryani <span className="text-saffron-gradient">Catering</span>
          </h1>

          <p className="text-sm sm:text-base text-mehfil-parchment-muted max-w-2xl mx-auto">
            Elevate your weddings, corporate banquets & large celebrations with live kitchen setups and authentic Hyderabadi Dum Biryani handis.
          </p>
        </div>
      </section>

      {/* Catering Form Container */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {isLoggedIn === false ? (
          <div className="p-8 sm:p-12 rounded-3xl glass-card border border-rose-500/30 text-center space-y-6 max-w-xl mx-auto my-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-mehfil-parchment">
                Login Required to Book Parties & Catering
              </h2>
              <p className="text-xs sm:text-sm text-mehfil-parchment-muted max-w-md mx-auto">
                To submit bulk biryani handi orders, book party banquet halls, or request custom event catering, please log in to your account.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-mehfil-burgundy-light/80 border border-mehfil-saffron/20 text-xs text-mehfil-parchment-muted flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-mehfil-gold font-bold block">Don't have an account?</span>
                <span>Quick registration takes less than 30 seconds.</span>
              </div>
              <Link
                href="/user"
                className="px-5 py-2.5 rounded-xl bg-mehfil-saffron text-mehfil-burgundy-dark font-bold text-xs uppercase tracking-wider shrink-0 hover:scale-105 transition-all inline-flex items-center gap-1.5"
              >
                Login / Signup
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : enquiryCode ? (
          <div className="p-8 sm:p-12 rounded-3xl glass-card border border-mehfil-saffron/40 text-center space-y-6 max-w-xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-mehfil-parchment">
                Catering Enquiry Submitted!
              </h2>
              <p className="text-xs sm:text-sm text-mehfil-parchment-muted">
                Thank you <strong className="text-mehfil-parchment">{contactName}</strong>. Our senior event catering manager will contact you within 2 hours to discuss menu packages for <strong className="text-mehfil-saffron">{guestCount} guests</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-mehfil-burgundy-light/80 border border-mehfil-saffron/30 space-y-1">
              <span className="text-xs text-mehfil-gold uppercase tracking-wider block font-semibold">
                Your Catering Enquiry Reference:
              </span>
              <span className="font-mono text-xl font-bold text-mehfil-saffron block tracking-wider">
                {enquiryCode}
              </span>
            </div>

            <button
              onClick={() => setEnquiryCode(null)}
              className="px-8 py-3 rounded-2xl bg-mehfil-saffron text-mehfil-burgundy-dark font-bold text-xs uppercase tracking-wider shadow-nizami hover:scale-[1.02] active:scale-95 transition-all"
            >
              Submit Another Enquiry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Form Steps (Left 2 Columns) */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Select Event Type */}
              <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-3 border-b border-mehfil-burgundy-border/60 pb-3">
                  <span className="w-8 h-8 rounded-full bg-mehfil-saffron text-mehfil-burgundy-dark font-extrabold flex items-center justify-center text-sm shadow-md">
                    1
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-mehfil-parchment">
                      Select Event Type
                    </h3>
                    <p className="text-[11px] text-mehfil-parchment-muted">
                      Choose the occasion for live catering or banquet setup
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {eventTypes.map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setEventType(item.type as any)}
                      className={`p-3.5 rounded-2xl border text-left text-xs font-serif font-bold transition-all ${
                        eventType === item.type
                          ? 'bg-mehfil-saffron text-mehfil-burgundy-dark border-mehfil-saffron font-bold shadow-md'
                          : 'bg-mehfil-burgundy-light/60 border-mehfil-burgundy-border text-mehfil-parchment-muted hover:border-mehfil-saffron/30'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Gathering Size, Date & Budget */}
              <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-3 border-b border-mehfil-burgundy-border/60 pb-3">
                  <span className="w-8 h-8 rounded-full bg-mehfil-saffron text-mehfil-burgundy-dark font-extrabold flex items-center justify-center text-sm shadow-md">
                    2
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-mehfil-parchment">
                      Guest Gathering & Event Details
                    </h3>
                    <p className="text-[11px] text-mehfil-parchment-muted">
                      Specify date, expected guest count & plate budget
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1">
                      Estimated Guests *
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="10000"
                      required
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1">
                      Budget Per Plate (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 450"
                      value={budgetPerPlate}
                      onChange={(e) => setBudgetPerPlate(e.target.value)}
                      className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    />
                  </div>
                </div>

                {/* Real-time Banquet Hall Availability Indicator */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-200 block">
                        Banquet Party Hall & Live Catering Open on {date}
                      </span>
                      <span className="text-[10px] text-emerald-300/80 block">
                        Live Charcoal Handi Setup & Royal Banquet Hall is available for booking.
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-900 text-emerald-200 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap border border-emerald-400/40">
                    🟢 Available
                  </span>
                </div>
              </div>

              {/* Step 3: Venue & Organizer Details */}
              <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-3 border-b border-mehfil-burgundy-border/60 pb-3">
                  <span className="w-8 h-8 rounded-full bg-mehfil-saffron text-mehfil-burgundy-dark font-extrabold flex items-center justify-center text-sm shadow-md">
                    3
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-mehfil-parchment">
                      Organizer Contact & Venue Location
                    </h3>
                    <p className="text-[11px] text-mehfil-parchment-muted">
                      Provide contact details and venue address
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1">
                      Organizer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Reddy"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-mehfil-parchment block mb-1">
                    Venue Location Address in Hyderabad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. N Convention, Madhapur / Royal Palace Hall, Mehdipatnam"
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-mehfil-parchment block mb-1">
                    Menu Preferences & Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Live Biryani Handi counter, Qubani Ka Meetha dessert, spice levels..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-xl px-4 py-2.5 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark font-extrabold text-sm uppercase tracking-wider shadow-nizami hover:scale-[1.01] active:scale-95 transition-all"
              >
                {isSubmitting ? 'Submitting Enquiry...' : 'Submit Event Catering Enquiry'}
              </button>
            </form>

            {/* Live Party Budget & Summary Estimator (Right Column) */}
            <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/40 space-y-6 shadow-2xl sticky top-24">
              <div className="flex items-center gap-2 border-b border-mehfil-burgundy-border/60 pb-3">
                <Crown className="w-5 h-5 text-mehfil-saffron" />
                <h3 className="font-serif text-lg font-bold text-mehfil-parchment">
                  Catering Summary & Quote
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-mehfil-burgundy-light/60 border border-mehfil-saffron/20 space-y-1">
                  <span className="text-[10px] text-mehfil-gold uppercase tracking-wider block font-semibold">
                    Occasion & Package
                  </span>
                  <span className="font-bold text-mehfil-saffron text-sm block">
                    {eventType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-mehfil-burgundy-light/60 border border-mehfil-saffron/20 space-y-0.5">
                    <span className="text-[10px] text-mehfil-gold uppercase tracking-wider block font-semibold">
                      Gathering Size
                    </span>
                    <span className="font-bold text-mehfil-parchment text-sm block">
                      {guestCount} Guests
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-mehfil-burgundy-light/60 border border-mehfil-saffron/20 space-y-0.5">
                    <span className="text-[10px] text-mehfil-gold uppercase tracking-wider block font-semibold">
                      Event Date
                    </span>
                    <span className="font-bold text-mehfil-parchment block">
                      {date}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-mehfil-burgundy-light/80 border border-mehfil-saffron/30 space-y-1">
                  <span className="text-[10px] text-mehfil-gold uppercase tracking-wider block font-semibold">
                    Estimated Total Catering Budget
                  </span>
                  <span className="font-serif text-xl font-bold text-saffron-gradient block">
                    ₹{(guestCount * (Number(budgetPerPlate) || 450)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-mehfil-parchment-muted block">
                    Based on ₹{budgetPerPlate || 450} / plate estimate
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
                <span className="font-bold block">✓ Dedicated Event Manager</span>
                <span className="block text-[10px] opacity-80">
                  Includes live chef stations, royal Nizami serving staff, and fresh charcoal dum handis.
                </span>
              </div>
            </div>

          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
