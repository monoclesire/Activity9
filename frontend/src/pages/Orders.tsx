import React from 'react';
import { Header } from '../components/Header';
import { Navigation } from './Products';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

interface OrdersPageProps {
  userData: { fullName: string; email: string; role: string; id: number } | null;
  orders: Order[];
  onNavigate: (page: string) => void;
  cartCount: number;
  wishlistCount: number;
}

export default function OrdersPage({ 
  userData, 
  orders, 
  onNavigate,
  cartCount,
  wishlistCount 
}: OrdersPageProps) {
  const handleLogout = () => {
    window.dispatchEvent(new Event('logout'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header 
          username={userData?.fullName || 'Customer'} 
          onLogout={handleLogout} 
        />
        
        <Navigation 
          currentPage="orders" 
          onNavigate={onNavigate}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
        />

        {/* Orders Content */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600">
                <circle cx="24" cy="24" r="18"/>
                <path d="M16 24l6 6 10-12"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Order #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{order.customerName} • {order.customerEmail}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.date)}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{item.quantity}x</span>
                        <span className="text-gray-700">{item.productName}</span>
                      </div>
                      <span className="text-gray-600 font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-indigo-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}