import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { productsAPI, adminAPI, categoriesAPI } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductManagementProps {
  onNavigate: (page: string) => void;
}

export function ProductManagement({ onNavigate }: ProductManagementProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAdmin();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    shortDescription: '',
    description: '',
    weight: '',
    material: '',
    stock: '10',
    images: '',
    active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      discountPrice: '',
      shortDescription: '',
      description: '',
      weight: '',
      material: '',
      stock: '10',
      images: '',
      active: true,
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      price: product.price?.toString() || '',
      discountPrice: product.discountPrice?.toString() || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      weight: product.weight || '',
      material: product.material || '',
      stock: product.stock?.toString() || '10',
      images: product.images?.join('\n') || '',
      active: product.active !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminAPI.products.delete(token, productId);
      setProducts(products.filter((p) => p.id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      shortDescription: formData.shortDescription,
      description: formData.description,
      weight: formData.weight,
      material: formData.material,
      stock: parseInt(formData.stock),
      images: formData.images
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url),
      active: formData.active,
    };

    try {
      if (editingProduct) {
        const res = await adminAPI.products.update(token, editingProduct.id, productData);
        setProducts(products.map((p) => (p.id === editingProduct.id ? res.product : p)));
        alert('Product updated successfully');
      } else {
        const res = await adminAPI.products.create(token, productData);
        setProducts([res.product, ...products]);
        alert('Product created successfully');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 text-sm hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
                <span>ADD PRODUCT</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl tracking-wider mb-8">PRODUCT MANAGEMENT</h1>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="tracking-wide">
                {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
              </h2>
              <button
                onClick={resetForm}
                className="text-sm text-gray-600 hover:text-black"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g., 10g"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g., Gold Plated"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief description for product card"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Image URLs (one per line)
                </label>
                <textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black font-mono text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Product is active (visible to customers)
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-black text-white px-6 py-2 text-sm hover:bg-gray-800"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'UPDATE' : 'CREATE'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center space-x-2 border border-gray-300 px-6 py-2 text-sm hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  <span>CANCEL</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">No products yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg p-4 flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      💎
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="tracking-wide mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-1 capitalize">{product.category}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">₹{product.price?.toLocaleString()}</span>
                        {product.discountPrice && (
                          <span className="text-xs text-green-600">
                            ₹{product.discountPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          product.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>

                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
