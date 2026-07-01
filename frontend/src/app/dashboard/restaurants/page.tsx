'use client';
import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '@/lib/auth-context';

const GET_RESTAURANTS = gql`
  query Restaurants {
    restaurants {
      id
      name
      cuisine
      country
      imageUrl
      rating
      menuItems {
        id
        name
        description
        price
        category
      }
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($restaurantId: String!, $items: [OrderItemInput!]!) {
    createOrder(restaurantId: $restaurantId, items: $items) {
      id
      totalAmount
      status
    }
  }
`;

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function RestaurantsPage() {
  const { user } = useAuth();
  const { data, loading } = useQuery(GET_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: (data) => {
      setOrderSuccess(`Order #${data.createOrder.id.slice(-8)} placed successfully!`);
      setCart([]);
      setShowCart(false);
      setTimeout(() => setOrderSuccess(''), 4000);
    },
  });

  const currency = user?.country === 'INDIA' ? '₹' : '$';
  const restaurants = data?.restaurants || [];

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItemId === item.id);
      if (existing) {
        return prev.map(c => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItemId === menuItemId);
      if (existing && existing.quantity > 1) {
        return prev.map(c => c.menuItemId === menuItemId ? { ...c, quantity: c.quantity - 1 } : c);
      }
      return prev.filter(c => c.menuItemId !== menuItemId);
    });
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleOrder = async () => {
    if (!selectedRestaurant || cart.length === 0) return;
    await createOrder({
      variables: {
        restaurantId: selectedRestaurant.id,
        items: cart.map(c => ({ menuItemId: c.menuItemId, quantity: c.quantity })),
      },
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-stone-400">Loading restaurants...</div>
      </div>
    );
  }

  const categories = selectedRestaurant
  ? Array.from(new Set(selectedRestaurant.menuItems.map((m: any) => m.category)))
  : [];

  return (
    <div className="p-8 animate-fade-in">
      {orderSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl animate-slide-in">
          ✅ {orderSuccess}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">
            {selectedRestaurant ? selectedRestaurant.name : 'Restaurants'}
          </h1>
          <p className="text-stone-500 mt-1">
            {selectedRestaurant ? `${selectedRestaurant.cuisine} cuisine` : `${user?.country === 'INDIA' ? '🇮🇳 India' : '🇺🇸 America'} · ${restaurants.length} restaurants`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedRestaurant && (
            <button
              onClick={() => { setSelectedRestaurant(null); setCart([]); }}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-sm transition-colors"
            >
              ← Back
            </button>
          )}
          {cart.length > 0 && (
            <button
              onClick={() => setShowCart(true)}
              className="relative px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-medium text-sm transition-colors"
            >
              🛒 Cart
              <span className="ml-2 bg-white text-orange-500 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {!selectedRestaurant ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r: any) => (
            <button
              key={r.id}
              onClick={() => setSelectedRestaurant(r)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden card-hover text-left"
            >
              {r.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-lg font-bold text-stone-900">{r.name}</h3>
                  <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    ★ {r.rating}
                  </span>
                </div>
                <p className="text-stone-500 text-sm">{r.cuisine}</p>
                <p className="text-stone-400 text-xs mt-2">{r.menuItems.length} items on menu</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          {categories.map((cat: any) => (
            <div key={cat} className="mb-8">
              <h3 className="font-display text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-400 rounded-full inline-block" />
                {cat}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedRestaurant.menuItems.filter((m: any) => m.category === cat).map((item: any) => {
                  const cartItem = cart.find(c => c.menuItemId === item.id);
                  return (
                    <div key={item.id} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-900 text-sm">{item.name}</h4>
                        <p className="text-stone-400 text-xs mt-0.5">{item.description}</p>
                        <p className="text-orange-600 font-bold text-sm mt-1">{currency}{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {cartItem ? (
                          <>
                            <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-colors">−</button>
                            <span className="w-5 text-center font-bold text-sm">{cartItem.quantity}</span>
                            <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors">+</button>
                          </>
                        ) : (
                          <button onClick={() => addToCart(item)} className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-sm font-medium transition-colors border border-orange-200">
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.menuItemId} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-stone-400 text-xs">x{item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">{currency}{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-stone-100">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">{currency}{cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleOrder}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Place Order
              </button>
              <p className="text-stone-400 text-xs text-center mt-2">
                A Manager or Admin will checkout your order
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
