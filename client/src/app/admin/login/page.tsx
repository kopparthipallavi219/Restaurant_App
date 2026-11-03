'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UtensilsCrossed, ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@mehfilbiryani.com');
  const [password, setPassword] = useState('MehfilNizami2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetchAPI<{ success: boolean; token: string; user: any }>(
        '/api/admin/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.success && response.token) {
        localStorage.setItem('mehfil_admin_token', response.token);
        localStorage.setItem('mehfil_admin_user', JSON.stringify(response.user));
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      // Fallback demo authentication if API server offline
      if (email === 'admin@mehfilbiryani.com' && password === 'MehfilNizami2026!') {
        localStorage.setItem('mehfil_admin_token', 'demo_admin_token_2026');
        localStorage.setItem(
          'mehfil_admin_user',
          JSON.stringify({ name: 'Mehfil Executive Admin', email, role: 'admin' })
        );
        router.push('/admin/dashboard');
      } else {
        setError(err.message || 'Invalid admin credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mehfil-burgundy-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-mehfil-saffron/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-card border border-mehfil-saffron/30 space-y-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mehfil-saffron to-mehfil-saffron-dark flex items-center justify-center shadow-nizami border border-mehfil-gold/40 mx-auto">
            <UtensilsCrossed className="w-7 h-7 text-mehfil-burgundy-dark" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-mehfil-parchment">
              Mehfil Admin Portal
            </h1>
            <p className="text-xs text-mehfil-parchment-muted mt-1">
              Protected Executive Authentication Dashboard
            </p>
          </div>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-mehfil-burgundy-light/60 border border-mehfil-saffron/30 text-xs space-y-1">
          <span className="text-mehfil-gold font-bold block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Executive Admin Credentials:
          </span>
          <span className="text-mehfil-parchment font-mono block">
            Email: admin@mehfilbiryani.com
          </span>
          <span className="text-mehfil-parchment font-mono block">
            Password: MehfilNizami2026!
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-mehfil-parchment block mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mehfil-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl pl-10 pr-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-mehfil-parchment block mb-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mehfil-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-mehfil-burgundy-light border border-mehfil-burgundy-border rounded-xl pl-10 pr-4 py-3 text-xs text-mehfil-parchment focus:border-mehfil-saffron focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-mehfil-saffron to-mehfil-saffron-dark text-mehfil-burgundy-dark font-bold text-xs uppercase tracking-wider shadow-nizami flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-xs text-mehfil-parchment-muted hover:text-mehfil-saffron">
            ← Return to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}
