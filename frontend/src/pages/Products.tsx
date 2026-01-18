import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Header } from '../components/Header';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface WishlistItem {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isFavorited, onToggleFavorite, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600 rounded-t-xl p-8 flex items-center justify-center h-40">
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-50 transition-colors"
        >
          <Heart
            size={18}
            className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}
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
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
          <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <button 
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className={`w-full font-semibold py-3 rounded-lg transition-colors ${
            product.stock > 0 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

interface NavigationProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  cartCount?: number;
  wishlistCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage = 'products', 
  onNavigate, 
  cartCount = 0,
  wishlistCount = 0 
}) => {
  const navItems = [
    {
      id: 'products',
      label: 'Products',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 12.75V5.25a1.5 1.5 0 0 0-.75-1.3l-6-3.45a1.5 1.5 0 0 0-1.5 0l-6 3.45A1.5 1.5 0 0 0 0 5.25v7.5a1.5 1.5 0 0 0 .75 1.3l6 3.45a1.5 1.5 0 0 0 1.5 0l6-3.45a1.5 1.5 0 0 0 .75-1.3z"/>
          <polyline points="0.25 5.22 7.5 9.01 14.75 5.22"/>
          <line x1="7.5" y1="16.56" x2="7.5" y2="9"/>
        </svg>
      ),
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7" cy="16" r="1"/>
          <circle cx="14" cy="16" r="1"/>
          <path d="M1 1h3l2.68 13.39a1 1 0 0 0 1 .84h7.72a1 1 0 0 0 .98-.84L17 5H5"/>
        </svg>
      ),
      badge: cartCount,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: <Heart size={18} />,
      badge: wishlistCount,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="9" r="7"/>
          <path d="M6 9l2 2 4-4"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-3 mb-6">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate && onNavigate(item.id)}
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${
            currentPage === item.id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item.icon}
          {item.label}
          {item.badge !== undefined && item.badge > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

interface ProductsPageProps {
  userData: { fullName: string; email: string; role: string; id: number } | null;
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  onUpdateCart: (items: CartItem[]) => void;
  onUpdateWishlist: (items: WishlistItem[]) => void;
  onNavigate: (page: string) => void;
}

export default function ProductsPage({ 
  userData, 
  cartItems, 
  wishlistItems,
  onUpdateCart, 
  onUpdateWishlist,
  onNavigate 
}: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    window.dispatchEvent(new Event('logout'));
  };

  const handleAddToCart = async (product: Product) => {
    if (!userData) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userData.id,
          productId: product.id,
          quantity: 1
        })
      });

      if (response.ok) {
        const cartItem = await response.json();
        
        // Update local state
        const existingItem = cartItems.find(item => item.id === cartItem.id);
        
        if (existingItem) {
          const updatedCart = cartItems.map(item =>
            item.id === cartItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          onUpdateCart(updatedCart);
        } else {
          onUpdateCart([...cartItems, {
            id: cartItem.id,
            name: cartItem.name,
            description: cartItem.description,
            price: cartItem.price,
            quantity: cartItem.quantity
          }]);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to cart');
    }
  };

  const handleToggleFavorite = (product: Product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (isInWishlist) {
      const updatedWishlist = wishlistItems.filter(item => item.id !== product.id);
      onUpdateWishlist(updatedWishlist);
    } else {
      onUpdateWishlist([...wishlistItems, product]);
    }
  };

  const isProductFavorited = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header 
          username={userData?.fullName || 'Customer'} 
          onLogout={handleLogout} 
        />
        <Navigation 
          currentPage="products" 
          onNavigate={onNavigate}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          wishlistCount={wishlistItems.length}
        />

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products available
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {products.map((product) => (
              <div key={product.id} className="w-64">
                <ProductCard 
                  product={product}
                  isFavorited={isProductFavorited(product.id)}
                  onToggleFavorite={() => handleToggleFavorite(product)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}