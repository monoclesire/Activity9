import React, { useState } from 'react';
import { Package, ShoppingCart, Award, Heart } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError('Please enter email and password');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

if (!response.ok) {
  setError(data.message || 'Invalid email or password');
  setLoading(false);
  return;
}

// Store user data in localStorage
localStorage.setItem('user', JSON.stringify({
  fullName: data.user.fullName,
  email: data.user.email,
  role: data.user.role,
  id: data.user.id
}));

alert(`Login successful!\nWelcome back, ${data.user.fullName}!`);

// Dispatch login event with user role
const loginEvent = new CustomEvent('loginSuccess', {
  detail: { 
    role: data.user.role,
    fullName: data.user.fullName 
  }
});
window.dispatchEvent(loginEvent);
      } else {
        if (!formData.fullName || !formData.email || !formData.password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Registration failed');
          setLoading(false);
          return;
        }

        alert(`${data.message}`);
        setFormData({ fullName: '', email: '', password: '' });
        setIsLogin(true);
      }
    } catch (err) {
      setError('Connection error. Please make sure the server is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="flex bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
        {/* Left Side - Branding */}
        <div className="w-1/2 p-12 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm flex items-center justify-center">
              <Package size={28} />
            </div>
            <h1 className="text-2xl font-bold m-0">Mini E-Commerce</h1>
          </div>
          
          <p className="text-white text-opacity-90 mb-8 leading-relaxed">
            Discover amazing products and enjoy a seamless shopping experience!
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <ShoppingCart size={18} className="text-white text-opacity-80" />
              <span className="text-white text-opacity-90 text-sm">Premium quality products</span>
            </div>
            <div className="flex items-center gap-3">
              <Award size={18} className="text-white text-opacity-80" />
              <span className="text-white text-opacity-90 text-sm">Easy checkout process</span>
            </div>
            <div className="flex items-center gap-3">
              <Heart size={18} className="text-white text-opacity-80" />
              <span className="text-white text-opacity-90 text-sm">Save your favorites</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2 bg-white p-10">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm border-none cursor-pointer transition-all ${
                isLogin 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm border-none cursor-pointer transition-all ${
                !isLogin 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-100 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your full name"
                  disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-indigo-600 disabled:opacity-60"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                disabled={loading}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-indigo-600 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                disabled={loading}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-indigo-600 disabled:opacity-60"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full text-white px-4 py-2.5 rounded-lg font-medium text-sm border-none shadow-md transition-all ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 cursor-pointer hover:bg-indigo-700 hover:shadow-lg'
              }`}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-xs text-indigo-600 no-underline hover:underline">
                Forgot password?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}