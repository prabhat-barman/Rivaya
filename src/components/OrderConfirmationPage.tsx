import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, MessageCircle, Home } from 'lucide-react';
import { ordersAPI, settingsAPI } from '../utils/api';

interface OrderConfirmationPageProps {
  orderId: string;
  onNavigate: (page: string) => void;
}

export function OrderConfirmationPage({ orderId, onNavigate }: OrderConfirmationPageProps) {
  const [order, setOrder] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [orderId]);

  const loadData = async () => {
    try {
      const [orderRes, settingsRes] = await Promise.all([
        ordersAPI.getById(orderId),
        settingsAPI.get(),
      ]);

      setOrder(orderRes.order);
      setSettings(settingsRes.settings);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Order not found</p>
          <button
            onClick={() => onNavigate('home')}
            className="text-sm tracking-wide text-amber-600 hover:text-amber-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I have a question about my order ${order.id}`
  );
  const whatsappLink = `https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg p-8 text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl tracking-wider mb-2">ORDER CONFIRMED!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. We've received your order.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-xl tracking-wide">{order.id}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="tracking-wide mb-4">ORDER DETAILS</h2>

          {/* Items */}
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            {order.items?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} × {item.quantity}
                </span>
                <span>₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−₹{order.discount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>
                {order.shipping === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `₹${order.shipping}`
                )}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="tracking-wide">Total</span>
              <span className="text-xl">₹{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="tracking-wide mb-4">SHIPPING ADDRESS</h2>
          <div className="text-sm text-gray-700">
            <p>{order.customer?.name}</p>
            <p>{order.customer?.phone}</p>
            {order.customer?.email && <p>{order.customer.email}</p>}
            <p className="mt-2">{order.customer?.address}</p>
            <p>
              {order.customer?.city}, {order.customer?.state} {order.customer?.pincode}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="tracking-wide mb-4">PAYMENT METHOD</h2>
          <p className="text-sm text-gray-700 capitalize">
            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Status: <span className="text-amber-600 capitalize">{order.status}</span>
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="tracking-wide mb-3">WHAT'S NEXT?</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✓ You'll receive a confirmation email/SMS shortly</li>
            <li>✓ We'll notify you when your order is shipped</li>
            <li>✓ Track your order status anytime</li>
            <li>✓ Expected delivery: 5-7 business days</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 text-sm tracking-wider hover:bg-gray-800 transition-colors rounded"
          >
            <Home className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </button>

          {settings?.whatsapp && (
            <button
              onClick={() => {
                const itemsList = order.items
                  .map((i: any) => `- ${i.name} x${i.quantity}`)
                  .join('\n');

                const message = `*New Order Placed!* 🛍️\n\n` +
                  `*Order ID:* ${order.id}\n` +
                  `*Total:* ₹${order.total?.toLocaleString()}\n` +
                  `*Payment:* ${order.paymentMethod === 'cod' ? 'COD' : 'Online'}\n\n` +
                  `*Items:*\n${itemsList}\n\n` +
                  `*Customer Details:*\n` +
                  `Name: ${order.customer?.name}\n` +
                  `Phone: ${order.customer?.phone}\n` +
                  `Address: ${order.customer?.address}, ${order.customer?.city}\n\n` +
                  `Please confirm this order.`;

                const url = `https://wa.me/917879029044?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
              }}
              className="flex items-center justify-center space-x-2 bg-[#25D366] text-white px-6 py-3 text-sm tracking-wider hover:bg-[#20bd5a] transition-colors rounded"
            >
              <MessageCircle className="w-4 h-4" />
              <span>SEND ORDER TO WHATSAPP</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
