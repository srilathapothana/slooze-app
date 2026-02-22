'use client';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ALL_ORDERS = gql`
  query AllOrders {
    allOrders {
      id
      status
      totalAmount
      createdAt
      country
      user {
        name
        email
        role
      }
      items {
        quantity
        price
        menuItem { name }
      }
    }
  }
`;

const CANCEL = gql`
  mutation CancelOrder($orderId: String!) {
    cancelOrder(orderId: $orderId) { id status }
  }
`;

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const roleColors: Record<string, string> = {
  ADMIN: 'text-purple-600 bg-purple-50',
  MANAGER: 'text-blue-600 bg-blue-50',
  MEMBER: 'text-green-600 bg-green-50',
};

export default function AllOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, refetch } = useQuery(ALL_ORDERS);
  const [cancelOrder] = useMutation(CANCEL, { onCompleted: () => refetch() });

  useEffect(() => {
    if (user && !['ADMIN', 'MANAGER'].includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const orders = data?.allOrders || [];
  const currency = user?.country === 'INDIA' ? '₹' : '$';

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-900">All Orders</h1>
        <p className="text-stone-500 mt-1">
          {user?.country === 'INDIA' ? '🇮🇳 India' : '🇺🇸 America'} · {orders.length} orders
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 text-left border-b border-stone-100">
              <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Order</th>
              <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Customer</th>
              <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Items</th>
              <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Amount</th>
              <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Status</th>
              <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Date</th>
              <th className="px-6 py-3 text-xs text-stone-500 uppercase tracking-wider font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-stone-400">#{order.id.slice(-8)}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-stone-900">{order.user.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${roleColors[order.user.role]}`}>
                    {order.user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-stone-500">{order.items.length} items</td>
                <td className="px-6 py-4 font-bold text-sm">{currency}{order.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => cancelOrder({ variables: { orderId: order.id } })}
                      className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-16 text-center text-stone-400">
            <div className="text-4xl mb-3">📊</div>
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
