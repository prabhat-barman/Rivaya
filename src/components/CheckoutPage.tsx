import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ordersAPI, settingsAPI, couponsAPI } from '../utils/api';

interface CheckoutPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart, cartTotal, clearCart } = useCart();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'online',
  });

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  useEffect(() => {
    loadSettings();
    
    // Redirect if cart is empty
    if (cart.length === 0) {
      onNavigate('cart');
    }
  }, [cart]);

  const loadSettings = async () => {
    try {
      const res = await settingsAPI.get();
      setSettings(res.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const res = await couponsAPI.validate(couponCode, cartTotal);
      setAppliedCoupon(res.coupon);
      setDiscount(res.discount);
    } catch (error: any) {
      alert(error.message || 'Invalid coupon code');
    }
  };

  const calculateShipping = () => {
    if (!settings) return 0;
    
    const freeShippingThreshold = settings.freeShippingAbove || 1000;
    const shippingCharges = settings.shippingCharges || 50;
    
    return cartTotal >= freeShippingThreshold ? 0 : shippingCharges;
  };

  const shipping = calculateShipping();
  const subtotal = cartTotal;
  const total = subtotal - discount + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: cart,
        subtotal,
        discount,
        shipping,
        total,
        couponCode: appliedCoupon?.code,
        paymentMethod: formData.paymentMethod,
      };

      const res = await ordersAPI.create(orderData);
      
      // Clear cart
      clearCart();
      
      // Navigate to confirmation page
      onNavigate('order-confirmation', { orderId: res.order.id });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('cart')}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-3xl tracking-wider mb-8">CHECKOUT</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="tracking-wide mb-4">CONTACT INFORMATION</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="tracking-wide mb-4">SHIPPING ADDRESS</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="tracking-wide mb-4">PAYMENT METHOD</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:border-black transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm">Online Payment</p>
                      <p className="text-xs text-gray-500">
                        Pay via UPI, Card, Netbanking
                      </p>
                    </div>
                  </label>

                  {settings?.enableCOD && (
                    <label className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:border-black transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <Truck className="w-5 h-5 mr-2 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-sm">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">
                          Pay when you receive
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h2 className="tracking-wide mb-4">ORDER SUMMARY</h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                {!appliedCoupon && (
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="COUPON CODE"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-gray-900 text-white text-sm rounded"
                      >
                        APPLY
                      </button>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>−₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6 pb-6 border-b border-gray-200">
                  <span className="tracking-wide">Total</span>
                  <span className="text-xl">₹{total.toLocaleString()}</span>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 text-sm tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
