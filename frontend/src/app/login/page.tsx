'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

const DEMO_ACCOUNTS = [
  { label: '👑 Nick Fury',       email: 'nick.fury@shield.com',       role: 'ADMIN',   sub: 'Admin · India'   },
  { label: '🦸 Captain Marvel',  email: 'captain.marvel@shield.com',  role: 'MANAGER', sub: 'Manager · India'   },
  { label: '🛡 Captain America', email: 'captain.america@shield.com', role: 'MANAGER', sub: 'Manager · America' },
  { label: '💜 Thanos',          email: 'thanos@shield.com',          role: 'MEMBER',  sub: 'Member · India'   },
  { label: '⚡ Thor',            email: 'thor@shield.com',            role: 'MEMBER',  sub: 'Member · India'   },
  { label: '🤠 Travis',          email: 'travis@shield.com',          role: 'MEMBER',  sub: 'Member · America' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setLoading(true);
    try {
      await login(acc.email, 'password123');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-orange-400" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border border-orange-400" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full border border-orange-400 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xl">🍽</span>
            </div>
            <span className="font-display text-2xl text-white font-bold">Slooze</span>
          </div>
          <h1 className="font-display text-6xl text-white font-bold leading-tight mb-6">
            Food ordering,<br />
            <span className="text-orange-400">role by role.</span>
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed mb-10">
            A sophisticated platform where Admins, Managers, and Members collaborate on food ordering with precise access control across India and America.
          </p>
          <div className="flex gap-3 flex-wrap">
            {['RBAC', 'Re-BAC', 'GraphQL', 'NestJS', 'Next.js'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full border border-stone-600 text-stone-400 text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-stone-900 rounded-2xl p-8 shadow-2xl border border-stone-800 animate-fade-in">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <span className="text-2xl">🍽</span>
              <span className="font-display text-xl text-white font-bold">Slooze</span>
            </div>
            <h2 className="font-display text-2xl text-white font-bold mb-2">Welcome back</h2>
            <p className="text-stone-400 text-sm mb-6">Sign in to your account</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-stone-400 text-xs font-medium mb-1 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-400 text-xs font-medium mb-1 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="border-t border-stone-800 pt-6">
              <p className="text-stone-500 text-xs uppercase tracking-wider font-medium mb-3">Demo Accounts (password: password123)</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => quickLogin(acc)}
                    disabled={loading}
                    className="text-left px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors group disabled:opacity-50"
                  >
                    <div className="text-white text-xs font-medium">{acc.label}</div>
                    <div className="text-stone-500 text-xs">{acc.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
