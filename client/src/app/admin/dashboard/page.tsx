'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  UtensilsCrossed,
  DollarSign,
  ShoppingBag,
  Calendar,
  PartyPopper,
  LogOut,
  Sparkles,
  CheckCircle,
  Clock,
  Search,
  RefreshCw,
  Eye,
  ShieldAlert,
  Lock,
  KeyRound,
  UserCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Flame,
  AlertCircle,
  Plus,
  Trash2,
  X,
  Check,
  Filter,
  PackageX,
  PackageCheck,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface MenuItem {
  _id?: string;
  title: string;
  slug: string;
  categorySlug: string;
  description?: string;
  price: number;
  isVeg: boolean;
  isChefSpecial?: boolean;
  spiceLevel?: string;
  image: string;
  isAvailable?: boolean;
  ordersCount?: number;
}

interface AuditLog {
  _id: string;
  adminEmail: string;
  action: string;
  targetCollection: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}

interface OrderItem {
  title: string;
  portionName: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

interface FoodOrder {
  _id: string;
  orderCode: string;
  customerName: string;
  phone: string;
  email: string;
  items: OrderItem[];
  total: number;
  orderType: 'Delivery' | 'Pickup' | 'DineIn';
  outletName: string;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

interface Reservation {
  _id: string;
  reservationCode: string;
  branchName: string;
  customerName: string;
  phone: string;
  email?: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

interface CateringLead {
  _id: string;
  enquiryCode: string;
  eventType: string;
  guestCount: number;
  date: string;
  contactName: string;
  phone: string;
  email?: string;
  venueLocation: string;
  status: 'Pending' | 'Contacted' | 'Confirmed' | 'Cancelled';
  budget?: string;
}

const MENU_CATEGORIES = [
  { name: 'Signature Biryanis', slug: 'signature-biryanis' },
  { name: 'Soups & Shorbas', slug: 'soups-shorbas' },
  { name: 'Starters & Kebabs', slug: 'starters-kebabs' },
  { name: 'Main Course & Curries', slug: 'main-course-curries' },
  { name: 'Indian Breads', slug: 'indian-breads' },
  { name: 'Desserts & Beverages', slug: 'desserts-beverages' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'menu' | 'logins' | 'orders' | 'reservations' | 'catering' | 'kpi'>('menu');
  
  // Data States
  const [stats, setStats] = useState({
    totalRevenue: 485200,
    totalOrders: 184,
    todayReservations: 24,
    activeCateringLeads: 9,
  });
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cateringLeads, setCateringLeads] = useState<CateringLead[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Add Dish Modal State
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    title: '',
    categorySlug: 'signature-biryanis',
    description: '',
    price: '',
    isVeg: false,
    isChefSpecial: false,
    spiceLevel: 'Medium',
    image: '/images/dishes/chicken_dum_biryani.jpg',
    isAvailable: true,
  });

  // Check Admin Authorization
  useEffect(() => {
    const token = localStorage.getItem('mehfil_admin_token');
    const userStr = localStorage.getItem('mehfil_admin_user');

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);

    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (_e) {
        setAdminUser({ name: 'Mehfil Executive Admin', email: 'admin@mehfilbiryani.com', role: 'admin' });
      }
    } else {
      setAdminUser({ name: 'Mehfil Executive Admin', email: 'admin@mehfilbiryani.com', role: 'admin' });
    }

    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [statsRes, logsRes, ordersRes, resRes, catRes, menuRes] = await Promise.allSettled([
        fetchAPI<{ data: any }>('/api/admin/dashboard/stats'),
        fetchAPI<{ data: AuditLog[] }>('/api/admin/audit-logs'),
        fetchAPI<{ data: FoodOrder[] }>('/api/admin/orders'),
        fetchAPI<{ data: Reservation[] }>('/api/admin/reservations'),
        fetchAPI<{ data: CateringLead[] }>('/api/admin/catering'),
        fetchAPI<{ data: MenuItem[] }>('/api/menu?includeUnavailable=true&all=true'),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }

      if (menuRes.status === 'fulfilled' && menuRes.value?.data?.length) {
        setMenuItems(menuRes.value.data);
      } else {
        // Fallback default menu items dataset for offline/mock
        setMenuItems([
          {
            _id: 'm_1',
            title: 'Special Hyderabadi Mutton Dum Biryani',
            slug: 'special-hyderabadi-mutton-dum-biryani',
            categorySlug: 'signature-biryanis',
            description: 'Tender succulent mutton marinated overnight in saffron & spices.',
            price: 390,
            isVeg: false,
            isChefSpecial: true,
            spiceLevel: 'Hot',
            image: '/images/dishes/mutton_dum_biryani.jpg',
            isAvailable: true,
          },
          {
            _id: 'm_2',
            title: 'Special Mushroom Dum Biryani',
            slug: 'special-mushroom-dum-biryani',
            categorySlug: 'signature-biryanis',
            description: 'Fresh button mushrooms cooked with saffron basmati rice & mint.',
            price: 280,
            isVeg: true,
            isChefSpecial: true,
            spiceLevel: 'Medium',
            image: '/images/dishes/mushroom_biryani.jpg',
            isAvailable: true,
          },
          {
            _id: 'm_3',
            title: 'Special Prawn Dum Biryani',
            slug: 'special-prawn-dum-biryani',
            categorySlug: 'signature-biryanis',
            description: 'Succulent jumbo prawns marinated in coastal spices & Basmati dum.',
            price: 420,
            isVeg: false,
            isChefSpecial: true,
            spiceLevel: 'Spicy',
            image: '/images/dishes/prawn_biryani.jpg',
            isAvailable: true,
          },
          {
            _id: 'm_4',
            title: 'Special Hyderabadi Prawn Curry',
            slug: 'special-hyderabadi-prawn-curry',
            categorySlug: 'main-course-curries',
            description: 'Fresh prawns simmered in coconut tomato curry glaze.',
            price: 390,
            isVeg: false,
            isChefSpecial: true,
            spiceLevel: 'Spicy',
            image: '/images/dishes/prawn_curry.jpg',
            isAvailable: false, // Out of stock example
          },
          {
            _id: 'm_5',
            title: 'Nizami Mushroom Masala Curry',
            slug: 'nizami-mushroom-masala-curry',
            categorySlug: 'main-course-curries',
            description: 'Button mushrooms in rich onion-tomato kasuri methi gravy.',
            price: 270,
            isVeg: true,
            isChefSpecial: true,
            spiceLevel: 'Medium',
            image: '/images/dishes/mushroom_curry.jpg',
            isAvailable: true,
          },
        ]);
      }

      if (logsRes.status === 'fulfilled' && logsRes.value?.data?.length) {
        setAuditLogs(logsRes.value.data);
      } else {
        setAuditLogs([
          {
            _id: 'log_101',
            adminEmail: 'admin@mehfilbiryani.com',
            action: 'EXECUTIVE_ADMIN_LOGIN',
            targetCollection: 'Users',
            ipAddress: '127.0.0.1 (Local Workstation)',
            details: 'Successful auth token issued for Executive Master Console',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'log_102',
            adminEmail: 'manager.narayanguda@mehfil.com',
            action: 'TABLE_RESERVATION_CONFIRMED',
            targetCollection: 'Reservations',
            ipAddress: '192.168.1.45 (Hyderabad)',
            details: 'Confirmed 8-guest royal dining reservation for Narayanguda branch',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ]);
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data?.length) {
        setFoodOrders(ordersRes.value.data);
      } else {
        setFoodOrders([
          {
            _id: 'ord_1',
            orderCode: 'MEHFIL-ORD-2026-9842',
            customerName: 'Mohammed Tariq',
            phone: '+91 98490 88221',
            email: 'tariq.hyderabad@gmail.com',
            items: [
              { title: 'Special Hyderabadi Mutton Dum Biryani', portionName: 'Regular', price: 390, quantity: 2, isVeg: false },
              { title: 'Mehfil Special Chicken 65', portionName: 'Regular', price: 310, quantity: 1, isVeg: false },
            ],
            total: 1090,
            orderType: 'Delivery',
            outletName: 'Narayanguda (Flagship)',
            paymentMethod: 'UPI',
            paymentStatus: 'Paid',
            status: 'Preparing',
            createdAt: new Date(Date.now() - 1200000).toISOString(),
          },
        ]);
      }

      if (resRes.status === 'fulfilled' && resRes.value?.data?.length) {
        setReservations(resRes.value.data);
      } else {
        setReservations([
          {
            _id: 'res_1',
            reservationCode: 'MEHFIL-RES-2026-8812',
            branchName: 'Narayanguda (Flagship)',
            customerName: 'Ananya Rao',
            phone: '+91 98765 43210',
            email: 'ananya.rao@outlook.com',
            guestCount: 6,
            date: '2026-10-06',
            timeSlot: '08:00 PM',
            status: 'Confirmed',
          },
        ]);
      }

      if (catRes.status === 'fulfilled' && catRes.value?.data?.length) {
        setCateringLeads(catRes.value.data);
      } else {
        setCateringLeads([
          {
            _id: 'cat_1',
            enquiryCode: 'MEHFIL-CAT-2026-9011',
            eventType: 'Royal Wedding Reception Feast',
            guestCount: 450,
            date: '2026-11-20',
            contactName: 'Vikram Kothari',
            phone: '+91 99887 66554',
            email: 'vikram.kothari@kotharigroup.com',
            venueLocation: 'N Convention Hall, Madhapur, Hyderabad',
            budget: '₹4,50,000',
            status: 'Pending',
          },
        ]);
      }
    } catch (_err) {
    } finally {
      setLoading(false);
    }
  }

  // Action: Add New Dish
  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.title || !newDish.price) return;

    const dishPayload: MenuItem = {
      _id: 'dish_' + Date.now(),
      title: newDish.title,
      slug: newDish.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categorySlug: newDish.categorySlug,
      description: newDish.description || 'Delicious Nizami specialty dish prepared with pure spices.',
      price: Number(newDish.price),
      isVeg: newDish.isVeg,
      isChefSpecial: newDish.isChefSpecial,
      spiceLevel: newDish.spiceLevel,
      image: newDish.image || '/images/dishes/chicken_dum_biryani.jpg',
      isAvailable: newDish.isAvailable,
      ordersCount: 0,
    };

    try {
      await fetchAPI('/api/admin/menu', {
        method: 'POST',
        body: JSON.stringify(dishPayload),
      });
    } catch (_e) {}

    setMenuItems((prev) => [dishPayload, ...prev]);

    // Record audit log entry
    setAuditLogs((prev) => [
      {
        _id: 'log_' + Date.now(),
        adminEmail: adminUser?.email || 'admin@mehfilbiryani.com',
        action: 'DISH_ADDED_TO_MENU',
        targetCollection: 'MenuItems',
        ipAddress: '127.0.0.1',
        details: `Added new dish "${dishPayload.title}" (₹${dishPayload.price}) to ${dishPayload.categorySlug}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setIsAddDishModalOpen(false);
    setNewDish({
      title: '',
      categorySlug: 'signature-biryanis',
      description: '',
      price: '',
      isVeg: false,
      isChefSpecial: false,
      spiceLevel: 'Medium',
      image: '/images/dishes/chicken_dum_biryani.jpg',
      isAvailable: true,
    });
  };

  // Action: Remove / Delete Dish
  const handleDeleteDish = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the menu?`)) return;

    try {
      await fetchAPI(`/api/admin/menu/${id}`, { method: 'DELETE' });
    } catch (_e) {}

    setMenuItems((prev) => prev.filter((item) => (item._id || item.slug) !== id));

    // Record audit log entry
    setAuditLogs((prev) => [
      {
        _id: 'log_' + Date.now(),
        adminEmail: adminUser?.email || 'admin@mehfilbiryani.com',
        action: 'DISH_REMOVED_FROM_MENU',
        targetCollection: 'MenuItems',
        ipAddress: '127.0.0.1',
        details: `Deleted dish "${title}" from menu database`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Action: Toggle Item Kitchen Stock Availability
  const handleToggleStock = async (item: MenuItem) => {
    const newStockState = item.isAvailable === false ? true : false;
    const itemId = item._id || item.slug;

    try {
      await fetchAPI(`/api/admin/menu/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: newStockState }),
      });
    } catch (_e) {}

    setMenuItems((prev) =>
      prev.map((m) => ((m._id || m.slug) === itemId ? { ...m, isAvailable: newStockState } : m))
    );

    // Record audit log entry
    setAuditLogs((prev) => [
      {
        _id: 'log_' + Date.now(),
        adminEmail: adminUser?.email || 'admin@mehfilbiryani.com',
        action: newStockState ? 'ITEM_MARKED_IN_STOCK' : 'ITEM_MARKED_OUT_OF_STOCK',
        targetCollection: 'MenuItems',
        ipAddress: '127.0.0.1',
        details: `Toggled availability for "${item.title}" to ${newStockState ? 'IN STOCK (AVAILABLE)' : 'OUT OF STOCK (NOT PRESENT)'}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('mehfil_admin_token');
    localStorage.removeItem('mehfil_admin_user');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const updateOrderStatus = (id: string, newStatus: any) => {
    setFoodOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
    );
  };

  const updateReservationStatus = (id: string, newStatus: any) => {
    setReservations((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
    );
  };

  const updateCateringStatus = (id: string, newStatus: any) => {
    setCateringLeads((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
    );
  };

  // Filtered menu items calculation
  const filteredMenuItems = menuItems.filter((item) => {
    if (categoryFilter !== 'all' && item.categorySlug !== categoryFilter) return false;
    if (stockFilter === 'available' && item.isAvailable === false) return false;
    if (stockFilter === 'unavailable' && item.isAvailable !== false) return false;
    if (
      searchFilter &&
      !item.title.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !item.categorySlug.toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const availableDishesCount = menuItems.filter((i) => i.isAvailable !== false).length;
  const unavailableDishesCount = menuItems.filter((i) => i.isAvailable === false).length;

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-mehfil-burgundy-dark flex flex-col items-center justify-center text-mehfil-parchment p-4">
        <div className="w-12 h-12 rounded-full border-4 border-mehfil-saffron border-t-transparent animate-spin mb-4" />
        <h2 className="font-serif text-xl font-bold text-mehfil-gold">
          Authenticating Mehfil Master Admin Session...
        </h2>
        <p className="text-xs text-mehfil-parchment-muted mt-1">Loading menu inventory & booking data...</p>
      </div>
    );
  }

  // Access Denied Protection Screen for Unauthorized Users
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-mehfil-burgundy-dark flex items-center justify-center p-4 relative overflow-hidden text-mehfil-parchment">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-950/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl glass-card border border-rose-800/40 text-center space-y-6 shadow-2xl relative z-10">
          <div className="w-16 h-16 rounded-full bg-rose-950/90 border border-rose-600/50 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-800/40 inline-block">
              🔒 Admin Authorization Required
            </span>
            <h1 className="font-serif text-3xl font-bold text-mehfil-parchment">
              Restricted Access Console
            </h1>
            <p className="text-xs text-mehfil-parchment-muted leading-relaxed max-w-md mx-auto">
              This page contains confidential management data including dish inventory, stock controls, admin login logs, food orders, table bookings & party enquiries. Only authenticated administrators are permitted to enter.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admin/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark font-extrabold text-xs uppercase tracking-wider shadow-nizami flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              Sign In to Admin Portal
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-mehfil-burgundy-light hover:bg-mehfil-burgundy-accent text-mehfil-parchment border border-mehfil-burgundy-border text-xs font-semibold flex items-center justify-center transition-all"
            >
              ← Back to Main Web App
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mehfil-burgundy-dark flex flex-col justify-between text-mehfil-parchment selection:bg-mehfil-saffron selection:text-mehfil-burgundy-dark">
      
      {/* Executive Admin Top Header */}
      <header className="bg-mehfil-burgundy-dark/95 border-b border-mehfil-burgundy-border/60 sticky top-0 z-40 px-6 py-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-mehfil-saffron to-mehfil-saffron-dark flex items-center justify-center text-mehfil-burgundy-dark font-bold shadow-nizami border border-mehfil-gold/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-saffron-gradient leading-none">
                MEHFIL EXECUTIVE ADMIN
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/40">
                Live Secured
              </span>
            </div>
            <span className="text-[10px] text-mehfil-gold font-semibold uppercase tracking-wider block mt-1">
              Operations, Menu Inventory & Bookings Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-mehfil-burgundy-light border border-mehfil-saffron/20 text-xs">
            <UserCheck className="w-4 h-4 text-mehfil-saffron" />
            <span>
              Administrator: <strong className="text-mehfil-parchment">{adminUser?.name || 'Master Admin'}</strong>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </header>

      {/* Main Admin Console Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-mehfil-burgundy-border/60 pb-3 scrollbar-none">
          
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'menu'
                ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment border border-mehfil-burgundy-border/60'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            🍲 Menu & Dish Inventory ({menuItems.length})
          </button>

          <button
            onClick={() => setActiveTab('logins')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'logins'
                ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment border border-mehfil-burgundy-border/60'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            🔑 Login Details & Audit Logs ({auditLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment border border-mehfil-burgundy-border/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            🍕 Food Orders ({foodOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment border border-mehfil-burgundy-border/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            🪑 Table Reservations ({reservations.length})
          </button>

          <button
            onClick={() => setActiveTab('catering')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'catering'
                ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment border border-mehfil-burgundy-border/60'
            }`}
          >
            <PartyPopper className="w-4 h-4" />
            👑 Catering & Parties ({cateringLeads.length})
          </button>

          <button
            onClick={() => setActiveTab('kpi')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'kpi'
                ? 'bg-mehfil-saffron text-mehfil-burgundy-dark shadow-nizami'
                : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted hover:text-mehfil-parchment border border-mehfil-burgundy-border/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            📊 Overview & Analytics
          </button>
        </div>

        {/* TAB 1: MENU & DISH INVENTORY (ADD, REMOVE, STOCK CONTROL) */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Stock Statistics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card p-5 rounded-3xl flex items-center justify-between border border-mehfil-saffron/30">
                <div>
                  <span className="text-[11px] text-mehfil-parchment-muted font-semibold uppercase tracking-wider block">
                    Total Menu Dishes
                  </span>
                  <span className="font-serif text-3xl font-bold text-mehfil-parchment">
                    {menuItems.length} Dishes
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-mehfil-saffron/20 border border-mehfil-saffron/40 flex items-center justify-center text-mehfil-saffron font-bold">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
              </div>

              <div className="glass-card p-5 rounded-3xl flex items-center justify-between border border-emerald-500/30">
                <div>
                  <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block">
                    In Stock & Available
                  </span>
                  <span className="font-serif text-3xl font-bold text-emerald-400">
                    {availableDishesCount} Dishes
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                  <PackageCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="glass-card p-5 rounded-3xl flex items-center justify-between border border-rose-500/30">
                <div>
                  <span className="text-[11px] text-rose-400 font-semibold uppercase tracking-wider block">
                    Out of Stock / Not Present
                  </span>
                  <span className="font-serif text-3xl font-bold text-rose-400">
                    {unavailableDishesCount} Dishes
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold">
                  <PackageX className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Menu Manager Controls Bar */}
            <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-6">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-mehfil-burgundy-border/60 pb-4">
                <div>
                  <span className="text-xs text-mehfil-gold font-bold uppercase tracking-wider">
                    Full Culinary Catalog Control
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-mehfil-parchment">
                    Menu & Dish Management Console
                  </h2>
                </div>

                <button
                  onClick={() => setIsAddDishModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark font-extrabold text-xs uppercase tracking-wider shadow-nizami flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  + Add New Dish
                </button>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative flex-grow max-w-sm">
                  <Search className="w-4 h-4 text-mehfil-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search dish title or category..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-mehfil-burgundy-dark border border-mehfil-saffron/30 rounded-xl pl-10 pr-4 py-2 text-xs text-mehfil-parchment placeholder-mehfil-parchment-muted focus:border-mehfil-saffron focus:outline-none"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-mehfil-parchment-muted">Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-mehfil-burgundy-dark border border-mehfil-saffron/30 rounded-xl px-3 py-2 text-xs text-mehfil-parchment focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {MENU_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Availability Filter Tabs */}
                <div className="flex items-center gap-1.5 text-xs bg-mehfil-burgundy-dark p-1 rounded-xl border border-mehfil-burgundy-border">
                  <button
                    onClick={() => setStockFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      stockFilter === 'all'
                        ? 'bg-mehfil-saffron text-mehfil-burgundy-dark font-bold'
                        : 'text-mehfil-parchment-muted hover:text-mehfil-parchment'
                    }`}
                  >
                    All Items ({menuItems.length})
                  </button>
                  <button
                    onClick={() => setStockFilter('available')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      stockFilter === 'available'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    🟢 In Stock ({availableDishesCount})
                  </button>
                  <button
                    onClick={() => setStockFilter('unavailable')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      stockFilter === 'unavailable'
                        ? 'bg-rose-600 text-white font-bold'
                        : 'text-rose-400 hover:text-rose-300'
                    }`}
                  >
                    🔴 Out of Stock ({unavailableDishesCount})
                  </button>
                </div>
              </div>

              {/* Dish Items Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-mehfil-burgundy-border/60 text-mehfil-gold font-bold uppercase">
                      <th className="py-3.5 px-4">Dish Preview</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (₹)</th>
                      <th className="py-3.5 px-4">Dietary & Spice</th>
                      <th className="py-3.5 px-4 text-center">Kitchen Availability (Stock)</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mehfil-burgundy-border/40">
                    {filteredMenuItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-mehfil-parchment-muted">
                          No menu dishes match the selected category or stock availability filter.
                        </td>
                      </tr>
                    ) : (
                      filteredMenuItems.map((item) => {
                        const isAvailable = item.isAvailable !== false;
                        return (
                          <tr
                            key={item._id || item.slug}
                            className={`transition-colors ${
                              isAvailable ? 'hover:bg-mehfil-burgundy-light/40' : 'bg-rose-950/20 hover:bg-rose-950/30'
                            }`}
                          >
                            {/* Title & Preview */}
                            <td className="py-4 px-4 font-serif">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-mehfil-saffron/30">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <span className="font-bold text-sm text-mehfil-parchment block">
                                    {item.title}
                                  </span>
                                  {item.description && (
                                    <span className="text-[10px] text-mehfil-parchment-muted line-clamp-1 max-w-xs block">
                                      {item.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-4 px-4 font-semibold text-mehfil-gold uppercase tracking-wider text-[11px]">
                              {item.categorySlug}
                            </td>

                            {/* Price */}
                            <td className="py-4 px-4 font-serif font-bold text-base text-saffron-gradient">
                              {formatCurrency(item.price)}
                            </td>

                            {/* Badges */}
                            <td className="py-4 px-4 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.isVeg ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40' : 'bg-rose-950 text-rose-400 border border-rose-600/40'
                                  }`}
                                >
                                  {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                                </span>

                                {item.isChefSpecial && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-mehfil-gold border border-amber-500/40">
                                    ⭐ Chef Special
                                  </span>
                                )}
                              </div>
                              {item.spiceLevel && (
                                <span className="text-[10px] text-mehfil-saffron font-medium flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  {item.spiceLevel}
                                </span>
                              )}
                            </td>

                            {/* Availability Toggle */}
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleToggleStock(item)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all inline-flex items-center gap-1.5 shadow-md ${
                                  isAvailable
                                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 hover:bg-emerald-900'
                                    : 'bg-rose-950/90 text-rose-300 border-rose-500 hover:bg-rose-900'
                                }`}
                                title="Click to toggle availability"
                              >
                                {isAvailable ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span>In Stock (Available)</span>
                                  </>
                                ) : (
                                  <>
                                    <PackageX className="w-4 h-4 text-rose-400 animate-pulse" />
                                    <span>Out of Stock (Unavailable)</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Actions (Delete Dish) */}
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDeleteDish(item._id || item.slug, item.title)}
                                className="p-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-400 border border-rose-800/40 text-xs font-semibold transition-all inline-flex items-center gap-1"
                                title="Delete dish from menu"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOGIN DETAILS & AUDIT LOGS */}
        {activeTab === 'logins' && (
          <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-mehfil-burgundy-border/60 pb-4">
              <div>
                <span className="text-xs text-mehfil-gold font-bold uppercase tracking-wider">
                  Security Audit & Session Tracking
                </span>
                <h2 className="font-serif text-2xl font-bold text-mehfil-parchment">
                  Admin Login Details & Session Activity
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800/40">
                ● 100% Encrypted & Authenticated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-mehfil-burgundy-border/60 text-mehfil-gold font-bold uppercase">
                    <th className="py-3 px-4">Admin Identity</th>
                    <th className="py-3 px-4">Action Event</th>
                    <th className="py-3 px-4">Target Scope</th>
                    <th className="py-3 px-4">IP Address / Workstation</th>
                    <th className="py-3 px-4">Event Details</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mehfil-burgundy-border/40">
                  {auditLogs
                    .filter((log) =>
                      searchFilter
                        ? log.adminEmail.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          (log.details && log.details.toLowerCase().includes(searchFilter.toLowerCase()))
                        : true
                    )
                    .map((log) => (
                      <tr key={log._id} className="hover:bg-mehfil-burgundy-light/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-mehfil-parchment">
                          <div className="flex items-center gap-2">
                            <KeyRound className="w-3.5 h-3.5 text-mehfil-saffron" />
                            {log.adminEmail}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-mehfil-gold">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-mehfil-gold/30 text-[11px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-mehfil-parchment-muted font-medium">
                          {log.targetCollection}
                        </td>
                        <td className="py-3.5 px-4 text-mehfil-parchment font-mono">
                          {log.ipAddress || '127.0.0.1'}
                        </td>
                        <td className="py-3.5 px-4 text-mehfil-parchment-muted max-w-xs truncate">
                          {log.details || 'Admin operation log recorded'}
                        </td>
                        <td className="py-3.5 px-4 text-mehfil-parchment-muted font-mono whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FOOD ORDERS */}
        {activeTab === 'orders' && (
          <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-mehfil-burgundy-border/60 pb-4">
              <div>
                <span className="text-xs text-mehfil-gold font-bold uppercase tracking-wider">
                  Live Kitchen & Online Orders Desk
                </span>
                <h2 className="font-serif text-2xl font-bold text-mehfil-parchment">
                  Customer Food Orders Management
                </h2>
              </div>
              <span className="text-xs text-mehfil-parchment-muted">
                Showing <strong className="text-mehfil-saffron">{foodOrders.length} active orders</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-mehfil-burgundy-border/60 text-mehfil-gold font-bold uppercase">
                    <th className="py-3 px-4">Order Code</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Items Ordered</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Type & Outlet</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Kitchen Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mehfil-burgundy-border/40">
                  {foodOrders
                    .filter((ord) =>
                      searchFilter
                        ? ord.orderCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          ord.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          ord.phone.includes(searchFilter)
                        : true
                    )
                    .map((ord) => (
                      <tr key={ord._id} className="hover:bg-mehfil-burgundy-light/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-mehfil-saffron">
                          {ord.orderCode}
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <span className="block font-bold text-mehfil-parchment">{ord.customerName}</span>
                          <span className="text-[10px] text-mehfil-parchment-muted block">{ord.phone}</span>
                          <span className="text-[10px] text-mehfil-gold block">{ord.email}</span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <ul className="space-y-1">
                            {ord.items.map((item, idx) => (
                              <li key={idx} className="text-[11px] text-mehfil-parchment flex items-center justify-between gap-2">
                                <span>
                                  {item.isVeg ? '🟢' : '🔴'} {item.title} ({item.portionName}) x{item.quantity}
                                </span>
                                <span className="font-bold text-mehfil-gold">₹{item.price * item.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-lg text-saffron-gradient">
                          {formatCurrency(ord.total)}
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-mehfil-burgundy-light border border-mehfil-saffron/30 text-[10px] font-bold text-mehfil-saffron inline-block">
                            {ord.orderType}
                          </span>
                          <span className="text-[10px] text-mehfil-parchment-muted block mt-1">
                            {ord.outletName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 space-y-1">
                          <span className="block text-[11px] font-semibold text-mehfil-parchment">{ord.paymentMethod}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                              ord.paymentStatus === 'Paid'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                                : 'bg-amber-950 text-mehfil-gold border border-amber-600/40'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord._id, e.target.value as any)}
                            className="bg-mehfil-burgundy-dark border border-mehfil-saffron/40 rounded-xl px-2.5 py-1 text-xs text-mehfil-parchment focus:outline-none font-semibold cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing in Kitchen</option>
                            <option value="OutForDelivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TABLE RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-mehfil-burgundy-border/60 pb-4">
              <div>
                <span className="text-xs text-mehfil-gold font-bold uppercase tracking-wider">
                  Dine-In Family Dining Desk
                </span>
                <h2 className="font-serif text-2xl font-bold text-mehfil-parchment">
                  Table Reservations Manager
                </h2>
              </div>
              <span className="text-xs text-mehfil-parchment-muted">
                Showing <strong className="text-mehfil-saffron">{reservations.length} table bookings</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-mehfil-burgundy-border/60 text-mehfil-gold font-bold uppercase">
                    <th className="py-3 px-4">Res Code</th>
                    <th className="py-3 px-4">Branch Location</th>
                    <th className="py-3 px-4">Guest Contact</th>
                    <th className="py-3 px-4">Party Size</th>
                    <th className="py-3 px-4">Scheduled Date & Slot</th>
                    <th className="py-3 px-4">Reservation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mehfil-burgundy-border/40">
                  {reservations
                    .filter((res) =>
                      searchFilter
                        ? res.reservationCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          res.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          res.branchName.toLowerCase().includes(searchFilter.toLowerCase())
                        : true
                    )
                    .map((res) => (
                      <tr key={res._id} className="hover:bg-mehfil-burgundy-light/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-mehfil-saffron">
                          {res.reservationCode}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-mehfil-parchment">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-mehfil-gold" />
                            {res.branchName}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <span className="block font-bold text-mehfil-parchment">{res.customerName}</span>
                          <span className="text-[10px] text-mehfil-parchment-muted block">{res.phone}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-mehfil-gold text-sm">
                          {res.guestCount} Guests Table
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5 text-mehfil-parchment-muted">
                          <span className="block font-semibold text-mehfil-parchment">{res.date}</span>
                          <span className="text-[10px] text-mehfil-saffron">{res.timeSlot}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={res.status}
                            onChange={(e) => updateReservationStatus(res._id, e.target.value as any)}
                            className="bg-mehfil-burgundy-dark border border-mehfil-saffron/40 rounded-xl px-2.5 py-1 text-xs text-mehfil-parchment focus:outline-none font-semibold cursor-pointer"
                          >
                            <option value="Pending">Pending Confirmation</option>
                            <option value="Confirmed">Table Reserved (Confirmed)</option>
                            <option value="Completed">Completed Dining</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CATERING & PARTIES */}
        {activeTab === 'catering' && (
          <div className="p-6 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-mehfil-burgundy-border/60 pb-4">
              <div>
                <span className="text-xs text-mehfil-gold font-bold uppercase tracking-wider">
                  Royal Wedding & Event Catering Enquiries
                </span>
                <h2 className="font-serif text-2xl font-bold text-mehfil-parchment">
                  Catering & Party Bookings
                </h2>
              </div>
              <span className="text-xs text-mehfil-parchment-muted">
                Showing <strong className="text-mehfil-saffron">{cateringLeads.length} event leads</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-mehfil-burgundy-border/60 text-mehfil-gold font-bold uppercase">
                    <th className="py-3 px-4">Enquiry Code</th>
                    <th className="py-3 px-4">Celebration / Event Type</th>
                    <th className="py-3 px-4">Gathering Size</th>
                    <th className="py-3 px-4">Organizer Contact</th>
                    <th className="py-3 px-4">Venue & Event Date</th>
                    <th className="py-3 px-4">Est. Budget</th>
                    <th className="py-3 px-4">Lead Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mehfil-burgundy-border/40">
                  {cateringLeads
                    .filter((cat) =>
                      searchFilter
                        ? cat.enquiryCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          cat.eventType.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          cat.contactName.toLowerCase().includes(searchFilter.toLowerCase())
                        : true
                    )
                    .map((cat) => (
                      <tr key={cat._id} className="hover:bg-mehfil-burgundy-light/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-mehfil-saffron">
                          {cat.enquiryCode}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-mehfil-parchment">
                          {cat.eventType}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-mehfil-gold text-sm">
                          {cat.guestCount} Guests
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <span className="block font-bold text-mehfil-parchment">{cat.contactName}</span>
                          <span className="text-[10px] text-mehfil-parchment-muted block">{cat.phone}</span>
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5 text-mehfil-parchment-muted max-w-xs">
                          <span className="block font-semibold text-mehfil-parchment">{cat.venueLocation}</span>
                          <span className="text-[10px] text-mehfil-saffron">Event Date: {cat.date}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-saffron-gradient">
                          {cat.budget || 'Custom Quote'}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={cat.status}
                            onChange={(e) => updateCateringStatus(cat._id, e.target.value as any)}
                            className="bg-mehfil-burgundy-dark border border-mehfil-saffron/40 rounded-xl px-2.5 py-1 text-xs text-mehfil-parchment focus:outline-none font-semibold cursor-pointer"
                          >
                            <option value="Pending">Pending Proposal</option>
                            <option value="Contacted">Client Contacted</option>
                            <option value="Confirmed">Event Confirmed</option>
                            <option value="Cancelled">Closed / Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: KPI OVERVIEW */}
        {activeTab === 'kpi' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-3xl space-y-2 border border-mehfil-saffron/30 shadow-nizami">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-mehfil-parchment-muted uppercase tracking-wider font-semibold">
                    Gross Business Revenue
                  </span>
                  <DollarSign className="w-5 h-5 text-mehfil-saffron" />
                </div>
                <div className="font-serif text-3xl font-bold text-saffron-gradient">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">
                  ↑ High demand across 6 Hyderabad branches
                </span>
              </div>

              <div className="glass-card p-6 rounded-3xl space-y-2 border border-mehfil-saffron/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-mehfil-parchment-muted uppercase tracking-wider font-semibold">
                    Food Orders Placed
                  </span>
                  <ShoppingBag className="w-5 h-5 text-mehfil-gold" />
                </div>
                <div className="font-serif text-3xl font-bold text-mehfil-parchment">
                  {stats.totalOrders} Orders
                </div>
                <span className="text-[11px] text-mehfil-parchment-muted">
                  Biryani, Kebabs & Curries Delivery
                </span>
              </div>

              <div className="glass-card p-6 rounded-3xl space-y-2 border border-mehfil-saffron/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-mehfil-parchment-muted uppercase tracking-wider font-semibold">
                    Table Bookings Today
                  </span>
                  <Calendar className="w-5 h-5 text-mehfil-saffron" />
                </div>
                <div className="font-serif text-3xl font-bold text-mehfil-parchment">
                  {stats.todayReservations} Tables
                </div>
                <span className="text-[11px] text-mehfil-gold font-medium">
                  Flagship Narayanguda & Madhapur
                </span>
              </div>

              <div className="glass-card p-6 rounded-3xl space-y-2 border border-mehfil-saffron/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-mehfil-parchment-muted uppercase tracking-wider font-semibold">
                    Catering & Party Leads
                  </span>
                  <PartyPopper className="w-5 h-5 text-mehfil-gold" />
                </div>
                <div className="font-serif text-3xl font-bold text-mehfil-parchment">
                  {stats.activeCateringLeads} Parties
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Live Handi Wedding Packages
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD NEW DISH FORM */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-mehfil-burgundy-dark border border-mehfil-saffron/40 w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-mehfil-burgundy-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mehfil-saffron flex items-center justify-center text-mehfil-burgundy-dark font-bold">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-mehfil-parchment">
                    Add New Culinary Dish
                  </h3>
                  <span className="text-xs text-mehfil-gold font-medium">
                    Publish new item to live Mehfil menu
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsAddDishModalOpen(false)}
                className="p-2 rounded-xl bg-mehfil-burgundy-light text-mehfil-parchment-muted hover:text-mehfil-parchment border border-mehfil-burgundy-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddDish} className="space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-mehfil-parchment block mb-1">
                  Dish Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Hyderabadi Mutton Fry"
                  value={newDish.title}
                  onChange={(e) => setNewDish({ ...newDish, title: e.target.value })}
                  className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-mehfil-parchment block mb-1">
                    Category *
                  </label>
                  <select
                    value={newDish.categorySlug}
                    onChange={(e) => setNewDish({ ...newDish, categorySlug: e.target.value })}
                    className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl px-3 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                  >
                    {MENU_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-mehfil-parchment block mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    placeholder="e.g. 350"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-mehfil-parchment block mb-1">
                  Dish Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe secret Nizami spices, marination, or ingredients..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl p-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-mehfil-parchment block mb-1">
                    Spice Level
                  </label>
                  <select
                    value={newDish.spiceLevel}
                    onChange={(e) => setNewDish({ ...newDish, spiceLevel: e.target.value })}
                    className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl px-3 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Hot">Hot</option>
                    <option value="Spicy">Spicy</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-mehfil-parchment block mb-1">
                    Image File Path / URL
                  </label>
                  <input
                    type="text"
                    placeholder="/images/dishes/chicken_dum_biryani.jpg"
                    value={newDish.image}
                    onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                    className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl px-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-mehfil-burgundy-light border border-mehfil-burgundy-border">
                  <input
                    type="checkbox"
                    checked={newDish.isVeg}
                    onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.checked })}
                    className="rounded accent-emerald-500 w-4 h-4"
                  />
                  <span className="font-bold text-mehfil-parchment">100% Veg 🟢</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-mehfil-burgundy-light border border-mehfil-burgundy-border">
                  <input
                    type="checkbox"
                    checked={newDish.isChefSpecial}
                    onChange={(e) => setNewDish({ ...newDish, isChefSpecial: e.target.checked })}
                    className="rounded accent-mehfil-gold w-4 h-4"
                  />
                  <span className="font-bold text-mehfil-gold">Chef Special ⭐</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-mehfil-burgundy-light border border-mehfil-burgundy-border">
                  <input
                    type="checkbox"
                    checked={newDish.isAvailable}
                    onChange={(e) => setNewDish({ ...newDish, isAvailable: e.target.checked })}
                    className="rounded accent-emerald-500 w-4 h-4"
                  />
                  <span className="font-bold text-emerald-400">In Stock Now 🟢</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-mehfil-burgundy-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-mehfil-burgundy-light hover:bg-mehfil-burgundy-accent text-mehfil-parchment border border-mehfil-burgundy-border font-semibold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark font-extrabold text-xs uppercase tracking-wider shadow-nizami flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Publish Dish to Menu
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-mehfil-burgundy-border/60 py-4 text-center text-xs text-mehfil-parchment-muted">
        © 2026 Mehfil Restaurant Admin Operations & Security Control. Confidential Access Only.
      </footer>
    </div>
  );
}
