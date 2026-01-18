import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, LogOut } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface FormData {
  name: string;
  price: string;
  stock: string;
}

interface Stats {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
}

const API_URL = 'http://localhost:3000/products';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    stock: '',
  });
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalStock: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.name || !formData.price || !formData.stock) return;
    
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Failed to update product');
        }
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Failed to create product');
        }
      }
      
      await fetchProducts();
      await fetchStats();
      setFormData({ name: '', price: '', stock: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error submitting form:', err);
    }
  };

  const handleEdit = (product: Product): void => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      await fetchProducts();
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting product:', err);
    }
  };

  const handleCancel = (): void => {
    setFormData({ name: '', price: '', stock: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = (): void => {
    window.dispatchEvent(new Event('logout'));
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Product Management</h1>
          <p className="text-slate-600">Manage your e-commerce inventory</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Product Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Add New Product
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter product name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-slate-200">
          <div className="text-slate-600">Loading products...</div>
        </div>
      ) : (
        <>
          {/* Products List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        No products found. Add your first product to get started!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                              <Package size={20} className="text-indigo-600" />
                            </div>
                            <span className="font-medium text-slate-800">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            product.stock > 20 
                              ? 'bg-green-100 text-green-700' 
                              : product.stock > 0 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.stock > 20 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Total Products</div>
              <div className="text-2xl font-bold text-slate-800">{stats.totalProducts}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Total Stock</div>
              <div className="text-2xl font-bold text-slate-800">{stats.totalStock}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Low Stock Items</div>
              <div className="text-2xl font-bold text-slate-800">{stats.lowStockItems}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}