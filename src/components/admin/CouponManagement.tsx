import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2, Check, X } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';

interface CouponManagementProps {
  onNavigate: (page: string) => void;
}

export function CouponManagement({ onNavigate }: CouponManagementProps) {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useAdmin();

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderValue: '',
    maxDiscount: '',
    expiryDate: '',
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    if (!token) return;
    
    try {
      const res = await adminAPI.coupons.getAll(token);
      setCoupons(res.coupons || []);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minOrderValue: '',
      maxDiscount: '',
      expiryDate: '',
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const couponData = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : undefined,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
      expiryDate: formData.expiryDate || undefined,
    };

    try {
      const res = await adminAPI.coupons.create(token, couponData);
      setCoupons([res.coupon, ...coupons]);
      alert('Coupon created successfully');
      resetForm();
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon');
    }
  };

  const handleDelete = async (code: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await adminAPI.coupons.delete(token, code);
      setCoupons(coupons.filter((c) => c.code !== code));
      alert('Coupon deleted successfully');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
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
                <span>ADD COUPON</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl tracking-wider mb-8">COUPON MANAGEMENT</h1>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="tracking-wide">CREATE NEW COUPON</h2>
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
                  <label className="block text-sm text-gray-600 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    required
                    placeholder="e.g., SAVE20"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black uppercase"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use uppercase letters and numbers</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Discount Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Discount Value * {formData.type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                    min="0"
                    step={formData.type === 'percentage' ? '1' : '0.01'}
                    max={formData.type === 'percentage' ? '100' : undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Minimum Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                {formData.type === 'percentage' && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Maximum Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      min="0"
                      step="0.01"
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no expiry</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-black text-white px-6 py-2 text-sm hover:bg-gray-800"
                >
                  <Check className="w-4 h-4" />
                  <span>CREATE COUPON</span>
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

        {/* Coupons List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">No coupons yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              Create your first coupon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {coupons.map((coupon) => {
              const expired = isExpired(coupon.expiryDate);
              
              return (
                <div
                  key={coupon.code}
                  className={`bg-white rounded-lg p-6 border-2 ${
                    expired ? 'border-gray-200 opacity-60' : 'border-green-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl tracking-widest bg-gray-100 px-4 py-2 rounded">
                          {coupon.code}
                        </span>
                        {expired && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            EXPIRED
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">Discount:</span>{' '}
                          {coupon.type === 'percentage'
                            ? `${coupon.value}% off`
                            : `₹${coupon.value} off`}
                          {coupon.maxDiscount && ` (Max: ₹${coupon.maxDiscount})`}
                        </p>
                        {coupon.minOrderValue && (
                          <p>
                            <span className="text-gray-600">Min Order:</span> ₹
                            {coupon.minOrderValue}
                          </p>
                        )}
                        <p>
                          <span className="text-gray-600">Expires:</span>{' '}
                          {formatDate(coupon.expiryDate)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(coupon.code)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="tracking-wide mb-2">💡 Coupon Tips</h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Use clear, memorable codes like SAVE20 or WELCOME10</li>
            <li>Set minimum order values to encourage larger purchases</li>
            <li>Create urgency with expiry dates</li>
            <li>For percentage discounts, consider setting a maximum discount amount</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
