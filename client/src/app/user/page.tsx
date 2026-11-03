'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  LogOut,
  ShoppingBag,
  Calendar,
  PartyPopper,
  CheckCircle2,
  Clock,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  PackageCheck,
  PackageX,
  KeyRound,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { fetchAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function UserPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'catering' | 'profile'>('orders');

  // User Data States
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [myReservations, setMyReservations] = useState<any[]>([]);
  const [myCatering, setMyCatering] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('mehfil_user_data');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        loadUserData(parsed.email);
      } catch (_e) {}
    }
  }, []);

  function loadUserData(userEmail: string) {
    // Load mock/real user activity data
    setMyOrders([
      {
        orderCode: 'MEHFIL-ORD-2026-9842',
        items: [
          { title: 'Special Hyderabadi Mutton Dum Biryani', quantity: 2, price: 390 },
          { title: 'Mehfil Special Chicken 65', quantity: 1, price: 310 },
        ],
        total: 1090,
        status: 'Preparing in Kitchen',
        outletName: 'Narayanguda (Flagship)',
        date: '2026-10-05 02:15 PM',
      },
      {
        orderCode: 'MEHFIL-ORD-2026-7731',
        items: [
          { title: 'Special Prawn Dum Biryani', quantity: 1, price: 420 },
          { title: 'Butter Naan', quantity: 2, price: 55 },
        ],
        total: 530,
        status: 'Delivered',
        outletName: 'Madhapur (IT Hub)',
        date: '2026-10-03 08:30 PM',
      },
    ]);

    setMyReservations([
      {
        reservationCode: 'MEHFIL-RES-2026-8812',
        branchName: 'Narayanguda (Flagship)',
        guestCount: 4,
        date: '2026-10-06',
        timeSlot: '08:00 PM',
        status: 'Confirmed (Table Reserved)',
        tableNumber: 'Table #14 (Window Section)',
      },
    ]);

    setMyCatering([
      {
        enquiryCode: 'MEHFIL-CAT-2026-9011',
        eventType: 'Royal Wedding Reception Feast',
        guestCount: 350,
        date: '2026-11-20',
        venueLocation: 'N Convention Hall, Madhapur',
        status: 'Confirmed (Banquet Reserved)',
      },
    ]);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    const userData = {
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      phone: '+91 98765 43210',
    };

    localStorage.setItem('mehfil_user_token', 'user_session_token_2026');
    localStorage.setItem('mehfil_user_data', JSON.stringify(userData));
    setUser(userData);
    loadUserData(userData.email);
  };

  const handleQuickDemoUser = () => {
    const userData = {
      name: 'Ananya Rao',
      email: 'ananya.rao@example.com',
      phone: '+91 98765 43210',
    };

    localStorage.setItem('mehfil_user_token', 'user_session_token_2026');
    localStorage.setItem('mehfil_user_data', JSON.stringify(userData));
    setUser(userData);
    loadUserData(userData.email);
  };

  const handleLogout = () => {
    localStorage.removeItem('mehfil_user_token');
    localStorage.removeItem('mehfil_user_data');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-mehfil-burgundy-dark flex flex-col justify-between text-mehfil-parchment">
      <Navbar />
      <CartDrawer />

      {/* Hero Header */}
      <section className="relative py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-mehfil-burgundy-light/40 to-mehfil-burgundy-dark text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-mehfil-saffron/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 text-mehfil-saffron text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-mehfil-gold" />
            Nizami Member Guest Portal
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-mehfil-parchment tracking-tight">
            User Account & <span className="text-saffron-gradient">Booking Hub</span>
          </h1>

          <p className="text-sm text-mehfil-parchment-muted max-w-xl mx-auto">
            Order online with live kitchen stock updates, reserve dining tables with empty slot indicators, & book party banquet halls.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {!user ? (
          /* LOGIN / REGISTER FORM */
          <div className="max-w-md mx-auto p-8 sm:p-10 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mehfil-saffron to-mehfil-saffron-dark flex items-center justify-center shadow-nizami border border-mehfil-gold/40 mx-auto text-mehfil-burgundy-dark font-bold">
                <User className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-mehfil-parchment">
                {isRegisterMode ? 'Create Mehfil Account' : 'Guest & Member Login'}
              </h2>
              <p className="text-xs text-mehfil-parchment-muted">
                Track your food orders, reserved tables & party banquet bookings
              </p>
            </div>

            {/* Quick Demo User Login Button */}
            <button
              onClick={handleQuickDemoUser}
              className="w-full py-3 rounded-2xl bg-amber-950/80 hover:bg-amber-900 border border-mehfil-gold/40 text-mehfil-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-mehfil-gold" />
              ⚡ Instant Demo User Login (Ananya Rao)
            </button>

            <div className="flex items-center gap-3 text-xs text-mehfil-parchment-muted">
              <div className="h-px bg-mehfil-burgundy-border/60 flex-grow" />
              <span>or sign in with email</span>
              <div className="h-px bg-mehfil-burgundy-border/60 flex-grow" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {isRegisterMode && (
                <div>
                  <label className="font-semibold text-mehfil-parchment block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-mehfil-parchment block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-mehfil-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl pl-10 pr-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-mehfil-parchment block mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-mehfil-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl pl-10 pr-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-rose-400 text-center text-xs">{error}</p>}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark font-extrabold text-xs uppercase tracking-wider shadow-nizami flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
              >
                {isRegisterMode ? 'Register Account' : 'Sign In to Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs text-mehfil-gold hover:underline"
              >
                {isRegisterMode
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Register Now"}
              </button>
            </div>
          </div>
        ) : (
          /* LOGGED IN USER DASHBOARD */
          <div className="space-y-8">
            
            {/* User Profile Welcome Banner */}
            <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mehfil-saffron to-mehfil-saffron-dark flex items-center justify-center text-mehfil-burgundy-dark font-serif font-bold text-2xl shadow-nizami border border-mehfil-gold/40">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-mehfil-parchment">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="text-xs text-mehfil-parchment-muted">
                    {user.email} • Mehfil Privilege Dining Account
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/menu"
                  className="px-5 py-2.5 rounded-xl bg-mehfil-saffron text-mehfil-burgundy-dark font-bold text-xs uppercase tracking-wider shadow-nizami flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order Food Online
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-rose-900 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <Link
                href="/menu"
                className="p-5 rounded-3xl glass-card border border-mehfil-saffron/20 hover:border-mehfil-saffron transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-mehfil-parchment group-hover:text-mehfil-saffron">
                    🍕 Online Menu
                  </span>
                  <ShoppingBag className="w-5 h-5 text-mehfil-saffron" />
                </div>
                <p className="text-mehfil-parchment-muted text-[11px]">
                  Check live dish stock availability & order Biryanis online.
                </p>
              </Link>

              <Link
                href="/reservations"
                className="p-5 rounded-3xl glass-card border border-mehfil-saffron/20 hover:border-mehfil-saffron transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-mehfil-parchment group-hover:text-mehfil-saffron">
                    🪑 Reserve Table
                  </span>
                  <Calendar className="w-5 h-5 text-mehfil-gold" />
                </div>
                <p className="text-mehfil-parchment-muted text-[11px]">
                  Check empty table count per time slot & book tables.
                </p>
              </Link>

              <Link
                href="/catering"
                className="p-5 rounded-3xl glass-card border border-mehfil-saffron/20 hover:border-mehfil-saffron transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-mehfil-parchment group-hover:text-mehfil-saffron">
                    👑 Party & Banquets
                  </span>
                  <PartyPopper className="w-5 h-5 text-mehfil-saffron" />
                </div>
                <p className="text-mehfil-parchment-muted text-[11px]">
                  Check Banquet Hall date availability & submit event requests.
                </p>
              </Link>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 border-b border-mehfil-burgundy-border/60 pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'orders'
                    ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                    : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment'
                }`}
              >
                🍕 My Food Orders ({myOrders.length})
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'reservations'
                    ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                    : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment'
                }`}
              >
                🪑 My Table Bookings ({myReservations.length})
              </button>

              <button
                onClick={() => setActiveTab('catering')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'catering'
                    ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                    : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment'
                }`}
              >
                👑 My Party Enquiries ({myCatering.length})
              </button>
            </div>

            {/* TAB CONTENT: FOOD ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {myOrders.map((ord, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl glass-card border border-mehfil-saffron/20 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-mehfil-burgundy-border/40 pb-3">
                      <div>
                        <span className="font-mono text-sm font-bold text-mehfil-saffron">
                          {ord.orderCode}
                        </span>
                        <span className="text-[11px] text-mehfil-parchment-muted block">
                          Placed at {ord.outletName} • {ord.date}
                        </span>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 font-bold text-xs border border-emerald-600/40">
                        ● {ord.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-mehfil-parchment">
                            {item.title} x{item.quantity}
                          </span>
                          <span className="font-bold text-mehfil-gold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-mehfil-burgundy-border/40 text-xs">
                      <span className="text-mehfil-parchment-muted">Total Paid</span>
                      <span className="font-serif text-lg font-bold text-saffron-gradient">
                        {formatCurrency(ord.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: RESERVATIONS */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {myReservations.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl glass-card border border-mehfil-saffron/20 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-mehfil-burgundy-border/40 pb-3">
                      <div>
                        <span className="font-mono font-bold text-mehfil-saffron text-sm">
                          {res.reservationCode}
                        </span>
                        <span className="text-xs text-mehfil-parchment font-semibold block mt-0.5">
                          {res.branchName}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-600/40">
                        {res.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-mehfil-parchment-muted block">Reserved Date</span>
                        <span className="font-bold text-mehfil-parchment">{res.date}</span>
                      </div>
                      <div>
                        <span className="text-mehfil-parchment-muted block">Time Slot</span>
                        <span className="font-bold text-mehfil-gold">{res.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-mehfil-parchment-muted block">Party Size</span>
                        <span className="font-bold text-mehfil-saffron">{res.guestCount} Guests</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: CATERING & PARTIES */}
            {activeTab === 'catering' && (
              <div className="space-y-4">
                {myCatering.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl glass-card border border-mehfil-saffron/20 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-mehfil-burgundy-border/40 pb-3">
                      <div>
                        <span className="font-mono font-bold text-mehfil-saffron text-sm">
                          {cat.enquiryCode}
                        </span>
                        <span className="text-xs text-mehfil-parchment font-semibold block mt-0.5">
                          {cat.eventType}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-950 text-mehfil-gold text-xs font-bold border border-amber-600/40">
                        {cat.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-mehfil-parchment-muted block">Event Date</span>
                        <span className="font-bold text-mehfil-parchment">{cat.date}</span>
                      </div>
                      <div>
                        <span className="text-mehfil-parchment-muted block">Guest Gathering</span>
                        <span className="font-bold text-mehfil-saffron">{cat.guestCount} Guests</span>
                      </div>
                      <div>
                        <span className="text-mehfil-parchment-muted block">Venue</span>
                        <span className="font-bold text-mehfil-gold">{cat.venueLocation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
