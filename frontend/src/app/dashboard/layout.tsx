'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '▦', roles: ['ADMIN', 'MANAGER', 'MEMBER'] },
  { href: '/dashboard/restaurants', label: 'Restaurants', icon: '🍽', roles: ['ADMIN', 'MANAGER', 'MEMBER'] },
  { href: '/dashboard/orders', label: 'My Orders', icon: '📋', roles: ['ADMIN', 'MANAGER', 'MEMBER'] },
  { href: '/dashboard/all-orders', label: 'All Orders', icon: '📊', roles: ['ADMIN', 'MANAGER'] },
  { href: '/dashboard/payments', label: 'Payments', icon: '💳', roles: ['ADMIN'] },
];

const roleColors: Record<string, string> = {
  ADMIN: 'bg-purple-500',
  MANAGER: 'bg-blue-500',
  MEMBER: 'bg-green-500',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽</div>
          <div className="text-stone-500">Loading...</div>
        </div>
      </div>
    );
  }

  const visibleNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 flex flex-col">
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽</span>
            <span className="font-display text-xl text-white font-bold">Slooze</span>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user.name}</div>
              <div className="flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${roleColors[user.role]}`} />
                <span className="text-stone-400 text-xs">{user.role}</span>
                <span className="text-stone-600 text-xs">·</span>
                <span className="text-stone-400 text-xs">{user.country === 'INDIA' ? '🇮🇳' : '🇺🇸'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {visibleNav.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? 'bg-orange-500 text-white font-medium'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Permissions panel */}
        <div className="p-4 mx-3 mb-4 rounded-xl bg-stone-800/50 border border-stone-700">
          <p className="text-stone-500 text-xs uppercase tracking-wider font-medium mb-2">Your Permissions</p>
          <div className="space-y-1">
            {[
              { label: 'View restaurants', allowed: true },
              { label: 'Create orders', allowed: true },
              { label: 'Checkout & pay', allowed: ['ADMIN', 'MANAGER'].includes(user.role) },
              { label: 'Cancel orders', allowed: ['ADMIN', 'MANAGER'].includes(user.role) },
              { label: 'Manage payments', allowed: user.role === 'ADMIN' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-2">
                <span className={p.allowed ? 'text-green-400' : 'text-stone-600'}>
                  {p.allowed ? '✓' : '✗'}
                </span>
                <span className={`text-xs ${p.allowed ? 'text-stone-300' : 'text-stone-600'}`}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-stone-800">
          <button
            onClick={logout}
            className="w-full text-stone-400 hover:text-white text-sm py-2 rounded-lg hover:bg-stone-800 transition-colors"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
