'use client';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

const MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id
      status
      totalAmount
      createdAt
      restaurantId
      items {
        id
        quantity
        price
        menuItem {
          name
        }
      }
    }
  }
`;

const MY_PAYMENTS = gql`
  query MyPaymentMethods {
    myPaymentMethods {
      id
      type
      last4
      cardBrand
      upiId
      isDefault
    }
  }
`;

const CHECKOUT = gql`
  mutation Checkout($orderId: String!, $paymentMethodId: String!) {
    checkout(orderId: $orderId, paymentMethodId: $paymentMethodId) {
      id
      status
    }
  }
`;

const CANCEL = gql`
  mutation CancelOrder($orderId: String!) {
    cancelOrder(orderId: $orderId) {
      id
      status
    }
  }
`;

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  PREPARING: 'bg-orange-100 text-orange-700 border-orange-200',
  DELIVERED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const { data, refetch } = useQuery(MY_ORDERS);
  const { data: pmData } = useQuery(MY_PAYMENTS);
  const [checkoutOrderId, setCheckoutOrderId] = useState('');
  const [selectedPm, setSelectedPm] = useState('');
  const [success, setSuccess] = useState('');

  const canManage = ['ADMIN', 'MANAGER'].includes(user?.role || '');
  const currency = user?.country === 'INDIA' ? '₹' : '$';

  const [checkout] = useMutation(CHECKOUT, {
    onCompleted: () => {
      setSuccess('Order confirmed!');
      setCheckoutOrderId('');
      refetch();
      setTimeout(() => setSuccess(''), 3000);
    },
  });

  const [cancelOrder] = useMutation(CANCEL, {
    onCompleted: () => {
      setSuccess('Order cancelled.');
      refetch();
      setTimeout(() => setSuccess(''), 3000);
    },
  });

  const orders = data?.myOrders || [];
  const paymentMethods = pmData?.myPaymentMethods || [];

  const pmLabel = (pm: any) => {
    if (pm.type === 'UPI') return `UPI: ${pm.upiId}`;
    return `${pm.cardBrand} ****${pm.last4}`;
  };

  return (
    <div className="p-8 animate-fade-in">
      {success && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl animate-slide-in">
          ✅ {success}
        </div>
      )}

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-900">My Orders</h1>
        <p className="text-stone-500 mt-1">{orders.length} orders total</p>
      </div>

      {!canManage && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          ⚠️ As a Member, you can view and create orders, but checkout and cancellation require a Manager or Admin.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-stone-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-stone-50">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-stone-400">#{order.id.slice(-8)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg font-display">{currency}{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="px-6 py-3">
                <div className="space-y-1">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-stone-700">{item.menuItem.name} × {item.quantity}</span>
                      <span className="text-stone-500">{currency}{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {canManage && order.status === 'PENDING' && (
                <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex items-center gap-3">
                  {paymentMethods.length > 0 ? (
                    <>
                      <select
                        value={checkoutOrderId === order.id ? selectedPm : ''}
                        onChange={e => { setCheckoutOrderId(order.id); setSelectedPm(e.target.value); }}
                        className="flex-1 border border-stone-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-orange-400"
                      >
                        <option value="">Select payment method</option>
                        {paymentMethods.map((pm: any) => (
                          <option key={pm.id} value={pm.id}>{pmLabel(pm)}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => checkout({ variables: { orderId: order.id, paymentMethodId: selectedPm } })}
                        disabled={!selectedPm || checkoutOrderId !== order.id}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Checkout
                      </button>
                    </>
                  ) : (
                    <p className="text-stone-500 text-sm">No payment methods. Admin must add one first.</p>
                  )}
                  <button
                    onClick={() => cancelOrder({ variables: { orderId: order.id } })}
                    className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors border border-red-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
