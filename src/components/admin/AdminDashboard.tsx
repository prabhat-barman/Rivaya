import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, IndianRupee, Clock, LogOut } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAdmin();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!token) return;

    try {
      const res = await adminAPI.getStats(token);
      setStats(res.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await adminAPI.logout(token);
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
    logout();
    onNavigate('admin-login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex flex-col">
              <span className="text-xl tracking-wider">RIVAYA ADMIN</span>
              <span className="text-xs text-gray-600">Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl tracking-wider mb-8">DASHBOARD</h1>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl mb-1">{stats?.totalProducts || 0}</p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl mb-1">{stats?.totalOrders || 0}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-3xl mb-1">{stats?.pendingOrders || 0}</p>
              <p className="text-sm text-gray-600">Pending Orders</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <IndianRupee className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl mb-1">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="tracking-wide mb-4">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('admin-products')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors text-left"
            >
              <Package className="w-6 h-6 mb-2" />
              <p className="tracking-wide">Manage Products</p>
              <p className="text-sm text-gray-600 mt-1">Add, edit, or remove products</p>
            </button>

            <button
              onClick={() => onNavigate('admin-orders')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors text-left"
            >
              <ShoppingBag className="w-6 h-6 mb-2" />
              <p className="tracking-wide">View Orders</p>
              <p className="text-sm text-gray-600 mt-1">Manage and track orders</p>
            </button>

            <button
              onClick={() => onNavigate('admin-coupons')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors text-left"
            >
              <span className="text-2xl mb-2 block">🎟️</span>
              <p className="tracking-wide">Manage Coupons</p>
              <p className="text-sm text-gray-600 mt-1">Create discount codes</p>
            </button>

            <button
              onClick={() => onNavigate('admin-settings')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors text-left"
            >
              <span className="text-2xl mb-2 block">⚙️</span>
              <p className="tracking-wide">Settings</p>
              <p className="text-sm text-gray-600 mt-1">Configure site & notifications</p>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="tracking-wide mb-2">👋 Welcome to Rivaya Admin Panel</h3>
          <p className="text-sm text-gray-700">
            Manage your jewellery store from here. Add products, process orders,
            create coupons, and configure settings.
          </p>
        </div>
      </div>
    </div>
  );
}
