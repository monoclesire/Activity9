import React, { useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { Navigation } from './Products';

interface WishlistItem {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface WishlistPageProps {
  userData: { fullName: string; email: string; role: string; id: number } | null;
  wishlistItems: WishlistItem[];
  onUpdateWishlist: (items: WishlistItem[]) => void;
  onNavigate: (page: string) => void;
  onAddToCart: (item: WishlistItem) => void;
  cartCount: number;
}

export default function WishlistPage({ 
  userData, 
  wishlistItems, 
  onUpdateWishlist, 
  onNavigate,
  onAddToCart,
  cartCount 
}: WishlistPageProps) {
  const [items, setItems] = useState<WishlistItem[]>(wishlistItems);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const removeItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    onUpdateWishlist(updatedItems);
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (item.stock > 0) {
      onAddToCart(item);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
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
        
        <Navigation currentPage="wishlist" onNavigate={onNavigate} cartCount={cartCount} />

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            Added to wishlist
          </div>
        )}

        {/* Wishlist Content */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-6">
              <Heart size={48} className="text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love for later!</p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Product Image/Icon */}
                <div className="relative bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600 rounded-t-xl p-8 flex items-center justify-center h-48">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-red-50 transition-colors group"
                  >
                    <Heart
                      size={18}
                      className="fill-red-500 text-red-500 group-hover:fill-red-600 group-hover:text-red-600"
                    />
                  </button>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path
                      d="M40 10L10 22V40C10 57 23 70 40 70C57 70 70 57 70 40V22L40 10Z"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.4"
                    />
                    <path
                      d="M40 10V70M10 22H70M22 40H58M22 52H58"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  </svg>
                </div>

                {/* Product Details */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-indigo-600">${item.price.toFixed(2)}</span>
                    <span className={`text-sm font-medium ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock === 0}
                    className={`w-full font-semibold py-3 rounded-lg transition-colors ${
                      item.stock > 0 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}