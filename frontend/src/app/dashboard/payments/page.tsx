'use client';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MY_PAYMENTS = gql`
  query MyPaymentMethods {
    myPaymentMethods {
      id
      type
      last4
      cardBrand
      upiId
      isDefault
      createdAt
    }
  }
`;

const ADD_PAYMENT = gql`
  mutation AddPaymentMethod($type: String!, $last4: String, $cardBrand: String, $upiId: String) {
    addPaymentMethod(type: $type, last4: $last4, cardBrand: $cardBrand, upiId: $upiId) {
      id
      type
    }
  }
`;

const SET_DEFAULT = gql`
  mutation SetDefaultPaymentMethod($id: String!) {
    setDefaultPaymentMethod(id: $id) { id isDefault }
  }
`;

const DELETE_PAYMENT = gql`
  mutation DeletePaymentMethod($id: String!) {
    deletePaymentMethod(id: $id) { id }
  }
`;

const typeIcons: Record<string, string> = {
  CREDIT_CARD: '💳',
  DEBIT_CARD: '🏧',
  UPI: '📱',
  WALLET: '👛',
};

export default function PaymentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, refetch } = useQuery(MY_PAYMENTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'CREDIT_CARD', last4: '', cardBrand: 'Visa', upiId: '' });
  const [success, setSuccess] = useState('');

  const [addPayment] = useMutation(ADD_PAYMENT, {
    onCompleted: () => {
      setSuccess('Payment method added!');
      setShowForm(false);
      setForm({ type: 'CREDIT_CARD', last4: '', cardBrand: 'Visa', upiId: '' });
      refetch();
      setTimeout(() => setSuccess(''), 3000);
    },
  });

  const [setDefault] = useMutation(SET_DEFAULT, { onCompleted: () => refetch() });
  const [deletePayment] = useMutation(DELETE_PAYMENT, { onCompleted: () => refetch() });

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.push('/dashboard');
  }, [user, router]);

  const payments = data?.myPaymentMethods || [];

  const handleAdd = () => {
    addPayment({
      variables: {
        type: form.type,
        last4: form.type !== 'UPI' ? form.last4 : undefined,
        cardBrand: form.type !== 'UPI' ? form.cardBrand : undefined,
        upiId: form.type === 'UPI' ? form.upiId : undefined,
      },
    });
  };

  const pmLabel = (pm: any) => {
    if (pm.type === 'UPI') return `${pm.upiId}`;
    return `${pm.cardBrand} ending in ****${pm.last4}`;
  };

  return (
    <div className="p-8 animate-fade-in">
      {success && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl animate-slide-in">
          ✅ {success}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Payment Methods</h1>
          <p className="text-stone-500 mt-1">Admin-only · Manage your payment options</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium text-sm transition-colors"
        >
          + Add Method
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payments.map((pm: any) => (
          <div key={pm.id} className={`relative bg-white rounded-2xl border-2 ${pm.isDefault ? 'border-orange-400' : 'border-stone-200'} p-6`}>
            {pm.isDefault && (
              <span className="absolute top-3 right-3 text-xs bg-orange-100 text-orange-600 font-medium px-2 py-0.5 rounded-full">Default</span>
            )}
            <div className="text-3xl mb-3">{typeIcons[pm.type]}</div>
            <p className="font-display text-lg font-bold text-stone-900">{pm.type.replace('_', ' ')}</p>
            <p className="text-stone-500 text-sm mt-0.5">{pmLabel(pm)}</p>
            <p className="text-stone-400 text-xs mt-1">Added {new Date(pm.createdAt).toLocaleDateString()}</p>
            <div className="mt-4 flex gap-2">
              {!pm.isDefault && (
                <button
                  onClick={() => setDefault({ variables: { id: pm.id } })}
                  className="flex-1 py-1.5 border border-stone-200 hover:border-orange-300 text-stone-600 hover:text-orange-600 rounded-lg text-xs font-medium transition-colors"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => deletePayment({ variables: { id: pm.id } })}
                className="py-1.5 px-3 border border-red-100 hover:border-red-300 text-red-400 hover:text-red-600 rounded-lg text-xs font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="col-span-3 bg-white rounded-2xl border border-stone-200 p-16 text-center">
            <div className="text-5xl mb-4">💳</div>
            <p className="text-stone-500 mb-4">No payment methods yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Add your first method
            </button>
          </div>
        )}
      </div>

      {/* Add payment modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Add Payment Method</h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-stone-500 text-xs uppercase tracking-wider font-medium mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                >
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="WALLET">Wallet</option>
                </select>
              </div>

              {form.type === 'UPI' ? (
                <div>
                  <label className="block text-stone-500 text-xs uppercase tracking-wider font-medium mb-1">UPI ID</label>
                  <input
                    value={form.upiId}
                    onChange={e => setForm(f => ({ ...f, upiId: e.target.value }))}
                    placeholder="name@upi"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-stone-500 text-xs uppercase tracking-wider font-medium mb-1">Card Brand</label>
                    <select
                      value={form.cardBrand}
                      onChange={e => setForm(f => ({ ...f, cardBrand: e.target.value }))}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    >
                      {['Visa', 'Mastercard', 'Amex', 'Discover'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-500 text-xs uppercase tracking-wider font-medium mb-1">Last 4 digits</label>
                    <input
                      value={form.last4}
                      onChange={e => setForm(f => ({ ...f, last4: e.target.value.slice(0, 4) }))}
                      placeholder="1234"
                      maxLength={4}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleAdd}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
