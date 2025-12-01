import React, { useEffect, useState } from 'react';
import { ArrowLeft, Eye, Package, CheckCircle } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';

interface OrderManagementProps {
  onNavigate: (page: string) => void;
}

export function OrderManagement({ onNavigate }: OrderManagementProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAdmin();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!token) return;
    
    try {
      const res = await adminAPI.orders.getAll(token);
      setOrders(res.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!token) return;

    try {
      const res = await adminAPI.orders.update(token, orderId, { status: newStatus });
      setOrders(orders.map((o) => (o.id === orderId ? res.order : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(res.order);
      }
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-blue-100 text-blue-700',
      packed: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => {
                if (selectedOrder) {
                  setSelectedOrder(null);
                } else {
                  onNavigate('admin-dashboard');
                }
              }}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{selectedOrder ? 'Back to Orders' : 'Back to Dashboard'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedOrder ? (
          /* Order Detail View */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl tracking-wider mb-2">ORDER #{selectedOrder.id}</h1>
                <p className="text-sm text-gray-600">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded capitalize ${getStatusColor(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Items */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="tracking-wide mb-4">ORDER ITEMS</h2>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p>₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>−₹{selectedOrder.discount?.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span>
                        {selectedOrder.shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `₹${selectedOrder.shipping}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="tracking-wide">Total</span>
                      <span className="text-xl">₹{selectedOrder.total?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="tracking-wide mb-4">CUSTOMER INFORMATION</h2>
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="text-gray-600 w-32">Name:</dt>
                      <dd>{selectedOrder.customer?.name}</dd>
                    </div>
                    <div className="flex">
                      <dt className="text-gray-600 w-32">Phone:</dt>
                      <dd>
                        <a
                          href={`tel:${selectedOrder.customer?.phone}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {selectedOrder.customer?.phone}
                        </a>
                      </dd>
                    </div>
                    {selectedOrder.customer?.email && (
                      <div className="flex">
                        <dt className="text-gray-600 w-32">Email:</dt>
                        <dd>
                          <a
                            href={`mailto:${selectedOrder.customer?.email}`}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {selectedOrder.customer?.email}
                          </a>
                        </dd>
                      </div>
                    )}
                    <div className="flex pt-2">
                      <dt className="text-gray-600 w-32">Address:</dt>
                      <dd>
                        {selectedOrder.customer?.address}<br />
                        {selectedOrder.customer?.city}, {selectedOrder.customer?.state}{' '}
                        {selectedOrder.customer?.pincode}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Update Status */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 sticky top-24">
                  <h2 className="tracking-wide mb-4">UPDATE STATUS</h2>
                  <div className="space-y-2">
                    {['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                          disabled={selectedOrder.status === status}
                          className={`w-full text-left px-4 py-3 rounded border text-sm capitalize transition-colors ${
                            selectedOrder.status === status
                              ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                              : 'border-gray-300 hover:border-black hover:bg-gray-50'
                          }`}
                        >
                          {selectedOrder.status === status && (
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                          )}
                          {status}
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
                    <p className="mb-2">Payment Method:</p>
                    <p className="capitalize">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div>
            <h1 className="text-3xl tracking-wider mb-8">ORDER MANAGEMENT</h1>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs tracking-wider">ORDER ID</th>
                        <th className="px-6 py-3 text-left text-xs tracking-wider">CUSTOMER</th>
                        <th className="px-6 py-3 text-left text-xs tracking-wider">DATE</th>
                        <th className="px-6 py-3 text-left text-xs tracking-wider">TOTAL</th>
                        <th className="px-6 py-3 text-left text-xs tracking-wider">STATUS</th>
                        <th className="px-6 py-3 text-left text-xs tracking-wider">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{order.id}</td>
                          <td className="px-6 py-4 text-sm">
                            <div>
                              <p>{order.customer?.name}</p>
                              <p className="text-xs text-gray-500">{order.customer?.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm">₹{order.total?.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
