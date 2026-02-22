'use client';
import { useAuth } from '@/lib/auth-context';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';

const MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id
      status
      totalAmount
      createdAt
      country
    }
  }
`;

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data } = useQuery(MY_ORDERS);
  const orders = data?.myOrders || [];

  const stats = {
    total: orders.length,
    pending: orders.filter((o: any) => o.status === 'PENDING').length,
    delivered: orders.filter((o: any) => o.status === 'DELIVERED').length,
    spent: orders.filter((o: any) => o.status !== 'CANCELLED').reduce((s: number, o: any) => s + o.totalAmount, 0),
  };

  const currency = user?.country === 'INDIA' ? '₹' : '$';

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-1">
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-stone-500">
          {user?.role} · {user?.country === 'INDIA' ? '🇮🇳 India' : '🇺🇸 America'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: stats.total, icon: '📋', color: 'bg-stone-900 text-white' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'bg-yellow-50 text-yellow-900' },
          { label: 'Delivered', value: stats.delivered, icon: '✅', color: 'bg-green-50 text-green-900' },
          { label: 'Total Spent', value: `${currency}${stats.spent.toFixed(2)}`, icon: '💰', color: 'bg-orange-50 text-orange-900' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold font-display mb-0.5">{s.value}</div>
            <div className="text-sm opacity-70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/dashboard/restaurants" className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-orange-300 card-hover">
          <div className="text-3xl mb-3">🍽</div>
          <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">Browse Restaurants</h3>
          <p className="text-stone-500 text-sm mt-1">Explore {user?.country === 'INDIA' ? 'Indian' : 'American'} cuisine</p>
        </Link>

        <Link href="/dashboard/orders" className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-orange-300 card-hover">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">My Orders</h3>
          <p className="text-stone-500 text-sm mt-1">View and manage your orders</p>
        </Link>

        {user?.role === 'ADMIN' && (
          <Link href="/dashboard/payments" className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-orange-300 card-hover">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">Payment Methods</h3>
            <p className="text-stone-500 text-sm mt-1">Manage payment options</p>
          </Link>
        )}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-stone-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-orange-500 text-sm hover:text-orange-600">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <div className="text-4xl mb-3">🍽</div>
            <p>No orders yet. Start ordering!</p>
            <Link href="/dashboard/restaurants" className="mt-4 inline-block text-orange-500 hover:text-orange-600 text-sm font-medium">Browse restaurants →</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Order ID</th>
                <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Amount</th>
                <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Status</th>
                <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order: any) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-stone-600">{order.id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-stone-900">{currency}{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
