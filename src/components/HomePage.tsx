import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../utils/api';
import { ProductCard } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll({ sort: 'newest' }),
        categoriesAPI.getAll(),
      ]);
      
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Error loading home page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const newArrivals = products.slice(0, 4);
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758995115857-2de1eb6283d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzY0NDU4NTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-amber-600" />
          <h1 className="text-5xl md:text-7xl tracking-wider mb-4">
            RIVAYA
          </h1>
          <p className="text-xl md:text-2xl tracking-widest text-gray-600 mb-8 italic">
            Where Elegance Whispers
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-black text-white px-8 py-3 text-sm tracking-wider hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl tracking-wider mb-2">SHOP BY CATEGORY</h2>
            <p className="text-gray-600">Discover your perfect piece</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onNavigate('shop', { category: category.id })}
                className="group"
              >
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-rose-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    ✨
                  </span>
                </div>
                <h3 className="text-sm tracking-wide group-hover:text-amber-600 transition-colors">
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl tracking-wider mb-2">NEW ARRIVALS</h2>
                <p className="text-gray-600">Fresh additions to our collection</p>
              </div>
              <button
                onClick={() => onNavigate('shop')}
                className="text-sm tracking-wide hover:text-amber-600 transition-colors flex items-center space-x-2"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Collection */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl tracking-wider mb-2">FEATURED COLLECTION</h2>
              <p className="text-gray-600">Handpicked pieces just for you</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gray-50 rounded-lg p-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl tracking-wide mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-6">
                Products will appear here once they are added by the admin.
              </p>
              <button
                onClick={() => onNavigate('admin')}
                className="text-sm tracking-wide text-amber-600 hover:text-amber-700"
              >
                Go to Admin Panel
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-sm tracking-wider mb-2">FREE SHIPPING</h3>
              <p className="text-sm text-gray-600">On orders above ₹1000</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-sm tracking-wider mb-2">AUTHENTIC QUALITY</h3>
              <p className="text-sm text-gray-600">Premium craftsmanship</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-sm tracking-wider mb-2">SECURE PAYMENTS</h3>
              <p className="text-sm text-gray-600">100% safe & secure</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
