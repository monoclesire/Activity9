import React, { useState, useEffect } from 'react';
import ProductManagement from './pages/ProductManagement';
import ProductsPage from './pages/Products';
import CartPage from './pages/Cart';
import WishlistPage from './pages/Wishlist';
import OrdersPage from './pages/Orders';
import AuthPage from './pages/Login';

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

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [userData, setUserData] = useState<{ fullName: string; email: string; role: string; id: number } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch cart from backend
  const fetchCart = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/cart/user/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/user/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        const formattedOrders = data.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          date: order.createdAt,
          items: order.items.map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price
          })),
          total: order.total,
          status: order.status
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      setCurrentPage(user.role === 'admin' ? 'product-management' : 'products');
      
      // Fetch cart and orders if user is not admin
      if (user.role !== 'admin') {
        fetchCart(user.id);
        fetchOrders(user.id);
      }
    }

    const handleLoginSuccess = (event: Event) => {
      const customEvent = event as CustomEvent;
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);
        setCurrentPage(user.role === 'admin' ? 'product-management' : 'products');
        
        // Fetch cart and orders after login
        if (user.role !== 'admin') {
          fetchCart(user.id);
          fetchOrders(user.id);
        }
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('user');
      setUserData(null);
      setCartItems([]);
      setWishlistItems([]);
      setOrders([]);
      setCurrentPage('login');
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleUpdateCart = (items: CartItem[]) => {
    setCartItems(items);
  };

  const handleUpdateWishlist = (items: WishlistItem[]) => {
    setWishlistItems(items);
  };

  const handleAddToCartFromWishlist = (item: WishlistItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      const updatedCart = cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || !userData) return;

    try {
      const response = await fetch('http://localhost:3000/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userData.id,
          fullName: userData.fullName,
          email: userData.email
        })
      });

      if (response.ok) {
        const order = await response.json();
        
        // Add to orders list
        const formattedOrder: Order = {
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          date: order.createdAt,
          items: order.items.map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price
          })),
          total: order.total,
          status: order.status
        };

        setOrders([formattedOrder, ...orders]);
        setCartItems([]);
        handleNavigate('orders');
      } else {
        const error = await response.json();
        alert(error.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {currentPage === 'login' && <AuthPage />}
      {currentPage === 'product-management' && <ProductManagement />}
      {currentPage === 'products' && (
        <ProductsPage 
          userData={userData}
          cartItems={cartItems}
          wishlistItems={wishlistItems}
          onUpdateCart={handleUpdateCart}
          onUpdateWishlist={handleUpdateWishlist}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'cart' && (
        <CartPage
          userData={userData}
          cartItems={cartItems}
          onUpdateCart={handleUpdateCart}
          onNavigate={handleNavigate}
          onCheckout={handleCheckout}
        />
      )}
      {currentPage === 'wishlist' && (
        <WishlistPage
          userData={userData}
          wishlistItems={wishlistItems}
          onUpdateWishlist={handleUpdateWishlist}
          onNavigate={handleNavigate}
          onAddToCart={handleAddToCartFromWishlist}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
      )}
      {currentPage === 'orders' && (
        <OrdersPage
          userData={userData}
          orders={orders}
          onNavigate={handleNavigate}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          wishlistCount={wishlistItems.length}
        />
      )}
    </div>
  );
}