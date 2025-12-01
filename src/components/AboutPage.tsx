import React from 'react';
import { Heart, Award, Sparkles, Users } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 to-rose-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-amber-600" />
          <h1 className="text-4xl md:text-5xl tracking-wider mb-4">ABOUT RIVAYA</h1>
          <p className="text-xl text-gray-600 italic">Where Elegance Whispers</p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-3xl tracking-wider mb-6 text-center">OUR STORY</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Rivaya Jewellery was born from a passion for creating pieces that celebrate the unique beauty of every woman. Our name, 'Rivaya,' embodies the flowing grace and timeless elegance that we infuse into each design.
            </p>
            <p>
              We believe that jewellery is more than just an accessory—it's a form of self-expression, a way to tell your story, and a celebration of life's precious moments. Each piece in our collection is carefully crafted to be both contemporary and timeless, allowing you to create your own signature style.
            </p>
            <p>
              From intricate temple jewellery to minimalist everyday pieces, from bold statement designs to delicate imitation sets, our diverse collection caters to every taste and occasion. We are committed to providing exceptional quality, authentic craftsmanship, and designs that make you feel confident and beautiful.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-8">
            <Heart className="w-10 h-10 text-amber-600 mb-4" />
            <h3 className="text-xl tracking-wide mb-3">OUR MISSION</h3>
            <p className="text-gray-700">
              To empower women through exquisite jewellery that enhances their natural beauty and celebrates their individuality. We strive to make luxury accessible without compromising on quality or craftsmanship.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <Award className="w-10 h-10 text-amber-600 mb-4" />
            <h3 className="text-xl tracking-wide mb-3">OUR PROMISE</h3>
            <p className="text-gray-700">
              Every piece is handpicked and quality-checked to ensure it meets our high standards. We guarantee authentic materials, exquisite craftsmanship, and designs that stand the test of time.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl tracking-wider mb-8 text-center">WHY CHOOSE RIVAYA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-sm tracking-wider mb-2">AUTHENTIC QUALITY</h3>
              <p className="text-sm text-gray-600">
                Premium materials and expert craftsmanship in every piece
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-sm tracking-wider mb-2">UNIQUE DESIGNS</h3>
              <p className="text-sm text-gray-600">
                Curated collection that blends tradition with contemporary style
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-sm tracking-wider mb-2">CUSTOMER FIRST</h3>
              <p className="text-sm text-gray-600">
                Dedicated support and hassle-free shopping experience
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-amber-50 to-rose-50 rounded-lg p-12">
          <h2 className="text-2xl tracking-wider mb-4">
            DISCOVER YOUR PERFECT PIECE
          </h2>
          <p className="text-gray-600 mb-6">
            Explore our collection and find jewellery that speaks to your soul
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-black text-white px-8 py-3 text-sm tracking-wider hover:bg-gray-800 transition-colors"
          >
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
}
