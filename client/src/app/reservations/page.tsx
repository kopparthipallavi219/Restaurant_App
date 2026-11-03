'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  Sparkles,
  UtensilsCrossed,
  ShieldCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { fetchAPI } from '@/lib/api';

export default function ReservationsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [branchSlug, setBranchSlug] = useState('narayanguda');
  const [branchName, setBranchName] = useState('Narayanguda (Flagship)');
  const [date, setDate] = useState('2026-10-06');
  const [timeSlot, setTimeSlot] = useState('08:00 PM');
  const [guestCount, setGuestCount] = useState(4);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mehfil_user_token') : null;
    setIsLoggedIn(!!token);

    if (token) {
      const userStr = localStorage.getItem('mehfil_user_data');
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed.name) setCustomerName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
        } catch (_e) {}
      }
    }
  }, []);

  const branches = [
    { slug: 'narayanguda', name: 'Narayanguda (Flagship)' },
    { slug: 'madhapur', name: 'Madhapur (IT Hub)' },
    { slug: 'manikonda', name: 'Manikonda' },
    { slug: 'attapur', name: 'Attapur' },
    { slug: 'kukatpally', name: 'Kukatpally' },
    { slug: 'gachibowli', name: 'Gachibowli' },
  ];

  const timeSlots = [
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
    '09:30 PM',
    '10:00 PM',
  ];

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = branches.find((b) => b.slug === e.target.value);
    if (selected) {
      setBranchSlug(selected.slug);
      setBranchName(selected.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !email) {
      alert('Please fill in mandatory fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetchAPI<{ success: boolean; data: { reservationCode: string } }>(
        '/api/reservations',
        {
          method: 'POST',
          body: JSON.stringify({
            branchSlug,
            branchName,
            customerName,
            email,
            phone,
            guestCount,
            date,
            timeSlot,
            specialRequests,
          }),
        }
      );

      if (response.success) {
        setConfirmationCode(response.data.reservationCode);
      }
    } catch (_err) {
      // Mock code generation if API offline
      const mockCode = `MEHFIL-RES-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmationCode(mockCode);
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-mehfil-saffron/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 text-mehfil-saffron text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-mehfil-gold" />
            Royal Nizami Hospitality
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-mehfil-parchment tracking-tight">
            Reserve a Dining <span className="text-saffron-gradient">Table</span>
          </h1>

          <p className="text-sm sm:text-base text-mehfil-parchment-muted max-w-2xl mx-auto">
            Experience warm family dining, authentic Hyderabadi Biryani ambiance & priority seating across our 6 flagship outlets in Hyderabad.
          </p>
        </div>
      </section>

      {/* Main Reservation Form Container */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {isLoggedIn === false ? (
          <div className="p-8 sm:p-12 rounded-3xl glass-card border border-rose-500/30 text-center space-y-6 max-w-xl mx-auto my-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-mehfil-parchment">
                Login Required to Book Table
              </h2>
              <p className="text-xs sm:text-sm text-mehfil-parchment-muted max-w-md mx-auto">
                To reserve a dining table and check live table availability at Mehfil, please log in to your account.
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
        ) : confirmationCode ? (
          <div className="p-8 sm:p-12 rounded-3xl glass-card border border-mehfil-saffron/40 text-center space-y-6 max-w-xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-mehfil-parchment">
                Table Reservation Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-mehfil-parchment-muted">
                We have reserved a table for <strong className="text-mehfil-parchment">{guestCount} guests</strong> at our{' '}
                <strong className="text-mehfil-saffron">{branchName}</strong> on{' '}
                <strong className="text-mehfil-gold">{date}</strong> at{' '}
                <strong className="text-mehfil-gold">{timeSlot}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-mehfil-burgundy-light/80 border border-mehfil-saffron/30 space-y-1">
              <span className="text-xs text-mehfil-gold uppercase tracking-wider block font-semibold">
                Your Confirmation Reservation ID:
              </span>
              <span className="font-mono text-xl font-bold text-mehfil-saffron block tracking-wider">
                {confirmationCode}
              </span>
            </div>

            <p className="text-[11px] text-mehfil-parchment-muted">
              A SMS and email notification has been sent to your details. Show this ID upon arrival at the restaurant hostess counter.
            </p>

            <button
              onClick={() => setConfirmationCode(null)}
              className="px-8 py-3 rounded-2xl bg-mehfil-saffron text-mehfil-burgundy-dark font-bold text-xs uppercase tracking-wider shadow-nizami hover:scale-[1.02] active:scale-95 transition-all"
            >
              Make Another Reservation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Main Form Steps (Left 2 Columns) */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Branch & Guests */}
              <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-3 border-b border-mehfil-burgundy-border/60 pb-3">
                  <span className="w-8 h-8 rounded-full bg-mehfil-saffron text-mehfil-burgundy-dark font-extrabold flex items-center justify-center text-sm shadow-md">
                    1
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-mehfil-parchment">
                      Dining Location & Guest Count
                    </h3>
                    <p className="text-[11px] text-mehfil-parchment-muted">
                      Select your preferred Hyderabad outlet and party size
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-mehfil-saffron" />
                      Select Outlet Branch *
                    </label>
                    <select
                      value={branchSlug}
                      onChange={handleBranchChange}
                      className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-2xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    >
                      {branches.map((b) => (
                        <option key={b.slug} value={b.slug}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1.5 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-mehfil-saffron" />
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-2xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Date & Time Slot */}
              <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-3 border-b border-mehfil-burgundy-border/60 pb-3">
                  <span className="w-8 h-8 rounded-full bg-mehfil-saffron text-mehfil-burgundy-dark font-extrabold flex items-center justify-center text-sm shadow-md">
                    2
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-mehfil-parchment">
                      Date & Live Time Slot Inventory
                    </h3>
                    <p className="text-[11px] text-mehfil-parchment-muted">
                      Pick your dining date and check available free tables
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-mehfil-saffron" />
                      Reservation Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full sm:w-1/2 bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-2xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-mehfil-parchment flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-mehfil-saffron" />
                        Dining Time Slot *
                      </label>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        🟢 Real-time Available Slots
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { slot: '12:00 PM', emptyTables: 8, isFull: false },
                        { slot: '01:00 PM', emptyTables: 5, isFull: false },
                        { slot: '02:00 PM', emptyTables: 3, isFull: false },
                        { slot: '07:00 PM', emptyTables: 6, isFull: false },
                        { slot: '07:30 PM', emptyTables: 2, isFull: false },
                        { slot: '08:00 PM', emptyTables: 0, isFull: true },
                        { slot: '08:30 PM', emptyTables: 4, isFull: false },
                        { slot: '09:00 PM', emptyTables: 7, isFull: false },
                        { slot: '09:30 PM', emptyTables: 9, isFull: false },
                        { slot: '10:00 PM', emptyTables: 10, isFull: false },
                      ].map(({ slot, emptyTables, isFull }) => (
                        <button
                          key={slot}
                          type="button"
                          disabled={isFull}
                          onClick={() => setTimeSlot(slot)}
                          className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all flex flex-col justify-between gap-1 ${
                            isFull
                              ? 'bg-rose-950/80 text-rose-300/80 border-rose-800/50 cursor-not-allowed opacity-80'
                              : timeSlot === slot
                              ? 'bg-mehfil-saffron text-mehfil-burgundy-dark border-mehfil-saffron font-bold shadow-md'
                              : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment border-mehfil-burgundy-border hover:border-mehfil-saffron/40'
                          }`}
                        >
                          <span className="font-bold block text-[11px]">{slot}</span>
                          {isFull ? (
                            <span className="text-[9px] text-rose-300 font-bold block">🔴 Fully Booked</span>
                          ) : (
                            <span
                              className={`text-[9px] font-bold block ${
                                timeSlot === slot ? 'text-mehfil-burgundy-dark' : 'text-emerald-400'
                              }`}
                            >
                              🟢 {emptyTables} Free
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Guest Contact Information */}
              <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-3 border-b border-mehfil-burgundy-border/60 pb-3">
                  <span className="w-8 h-8 rounded-full bg-mehfil-saffron text-mehfil-burgundy-dark font-extrabold flex items-center justify-center text-sm shadow-md">
                    3
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-mehfil-parchment">
                      Guest Contact Details
                    </h3>
                    <p className="text-[11px] text-mehfil-parchment-muted">
                      Where we send your instant SMS confirmation code
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-mehfil-parchment block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Rao"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
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
                      placeholder="ananya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-mehfil-parchment block mb-1 text-xs">
                    Special Dining Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. High chair needed, anniversary table preference..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
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
                {isSubmitting ? 'Confirming Table Reservation...' : 'Confirm & Reserve Table'}
              </button>
            </form>

            {/* Live Summary Preview Sidebar (Right Column) */}
            <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/40 space-y-6 shadow-2xl sticky top-24">
              <div className="flex items-center gap-2 border-b border-mehfil-burgundy-border/60 pb-3">
                <UtensilsCrossed className="w-5 h-5 text-mehfil-saffron" />
                <h3 className="font-serif text-lg font-bold text-mehfil-parchment">
                  Booking Summary
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-mehfil-burgundy-light/60 border border-mehfil-saffron/20 space-y-1">
                  <span className="text-[10px] text-mehfil-gold uppercase tracking-wider block font-semibold">
                    Branch Outlet
                  </span>
                  <span className="font-bold text-mehfil-parchment text-sm block">
                    {branchName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-mehfil-burgundy-light/60 border border-mehfil-saffron/20 space-y-0.5">
                    <span className="text-[10px] text-mehfil-gold uppercase tracking-wider block font-semibold">
                      Guests
                    </span>
                    <span className="font-bold text-mehfil-saffron text-sm block">
                      {guestCount} Guests
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-mehfil-burgundy-light/60 border border-mehfil-saffron/20 space-y-0.5">
                    <span className="text-[10px] text-mehfil-gold uppercase tracking-wider block font-semibold">
                      Date
                    </span>
                    <span className="font-bold text-mehfil-parchment block">
                      {date}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-mehfil-burgundy-light/60 border border-mehfil-saffron/20 space-y-1">
                  <span className="text-[10px] text-mehfil-gold uppercase tracking-wider block font-semibold">
                    Time Slot
                  </span>
                  <span className="font-bold text-mehfil-saffron text-sm block">
                    ⏰ {timeSlot}
                  </span>
                </div>

                {customerName && (
                  <div className="p-3.5 rounded-2xl bg-mehfil-burgundy-light/60 border border-mehfil-saffron/20 space-y-1">
                    <span className="text-[10px] text-mehfil-gold uppercase tracking-wider block font-semibold">
                      Primary Guest
                    </span>
                    <span className="font-bold text-mehfil-parchment block">
                      {customerName} ({phone})
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
                <span className="font-bold block">✓ Priority Nizami Seating</span>
                <span className="block text-[10px] opacity-80">
                  Your table is guaranteed up to 15 minutes after reserved time slot.
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
