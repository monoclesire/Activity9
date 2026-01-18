import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { Navigation } from './Products';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartPageProps {
  userData: { fullName: string; email: string; role: string; id: number } | null;
  cartItems: CartItem[];
  onUpdateCart: (items: CartItem[]) => void;
  onNavigate: (page: string) => void;
}

interface CartPageProps {
  userData: { fullName: string; email: string; role: string; id: number } | null;
  cartItems: CartItem[];
  onUpdateCart: (items: CartItem[]) => void;
  onNavigate: (page: string) => void;
  onCheckout: () => void;  // Add this
}
export default function CartPage({ userData, cartItems, onUpdateCart, onNavigate, onCheckout }: CartPageProps) {
  const [items, setItems] = useState<CartItem[]>(cartItems);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

const updateQuantity = async (id: number, change: number) => {
  if (!userData) return;
  
  const item = items.find(i => i.id === id);
  if (!item) return;

  const newQuantity = Math.max(1, item.quantity + change);
  
  try {
    const response = await fetch(`http://localhost:3000/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userData.id,
        quantity: newQuantity
      })
    });

    if (response.ok) {
      const updatedItems = items.map(item => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setItems(updatedItems);
      onUpdateCart(updatedItems);
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to update quantity');
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    alert('An error occurred while updating quantity');
  }
};

const removeItem = async (id: number) => {
  if (!userData) return;

  try {
    const response = await fetch(`http://localhost:3000/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userData.id
      })
    });

    if (response.ok) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      onUpdateCart(updatedItems);
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to remove item');
    }
  } catch (error) {
    console.error('Error removing item:', error);
    alert('An error occurred while removing item');
  }
};
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    onCheckout();
  };

  const handleLogout = () => {
    window.dispatchEvent(new Event('logout'));
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header 
          username={userData?.fullName || 'Customer'} 
          onLogout={handleLogout} 
        />
        
        <Navigation currentPage="cart" onNavigate={onNavigate} />

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            Added to cart
          </div>
        )}

        {/* Cart Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => onNavigate('products')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                    {/* Product Icon */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                          d="M16 4L4 8.8V16C4 22.8 9.2 28 16 28C22.8 28 28 22.8 28 16V8.8L16 4Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.4"
                        />
                        <path
                          d="M16 4V28M4 8.8H28M8.8 16H23.2M8.8 20.8H23.2"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                      </svg>
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={16} className="text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[80px]">
                      <p className="font-semibold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-6">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-indigo-600">${calculateTotal().toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-lg transition-colors shadow-sm"
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}