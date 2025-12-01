import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { settingsAPI } from '../utils/api';

export function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await settingsAPI.get();
      setSettings(res.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleEmailSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    const subject = `Contact Form: Message from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`;

    window.location.href = `mailto:prabhatbarman98@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsAppSubmit = () => {
    if (!formData.name || !formData.message) {
      alert('Please fill in your name and message');
      return;
    }

    const text = `*New Contact Message*\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage: ${formData.message}`;

    window.open(`https://wa.me/917879029044?text=${encodeURIComponent(text)}`, '_blank');
  };

  const whatsappLink = settings?.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`
    : '#';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-50 to-rose-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl tracking-wider mb-4">GET IN TOUCH</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl tracking-wider mb-8">CONTACT INFORMATION</h2>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm tracking-wider mb-1">PHONE</h3>
                  <a
                    href={`tel:${settings?.contactPhone}`}
                    className="text-gray-700 hover:text-amber-600"
                  >
                    {settings?.contactPhone || '+91 98765 43210'}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Mon-Sat: 10:00 AM - 7:00 PM
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm tracking-wider mb-1">EMAIL</h3>
                  <a
                    href={`mailto:${settings?.contactEmail}`}
                    className="text-gray-700 hover:text-amber-600"
                  >
                    {settings?.contactEmail || 'info@rivayajewellery.com'}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm tracking-wider mb-1">WHATSAPP</h3>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-amber-600"
                  >
                    {settings?.whatsapp || '+91 98765 43210'}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Quick support available
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm tracking-wider mb-1">ADDRESS</h3>
                  <p className="text-gray-700">
                    {settings?.address || 'Mumbai, Maharashtra, India'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm tracking-wider mb-4">FOLLOW US</h3>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl tracking-wider mb-8">SEND US A MESSAGE</h2>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleEmailSubmit}
                  className="w-full bg-black text-white px-6 py-3 text-sm tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  SEND VIA EMAIL
                </button>
                <button
                  onClick={handleWhatsAppSubmit}
                  className="w-full bg-[#25D366] text-white px-6 py-3 text-sm tracking-wider hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  SEND VIA WHATSAPP
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Choose your preferred method to send the message directly to us.
              </p>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-sm tracking-wider mb-2">CUSTOMER SUPPORT</h3>
              <p className="text-sm text-gray-600">
                Our team is here to help you with any questions
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-sm tracking-wider mb-2">SHIPPING SUPPORT</h3>
              <p className="text-sm text-gray-600">
                Track your order or get shipping assistance
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-sm tracking-wider mb-2">PRODUCT QUERIES</h3>
              <p className="text-sm text-gray-600">
                Need help choosing the perfect piece?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
