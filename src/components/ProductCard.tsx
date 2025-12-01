import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: any;
  onNavigate: (page: string, data?: any) => void;
}

export function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      images: product.images || [],
    });
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div
      onClick={() => onNavigate('product', { id: product.id })}
      className="group cursor-pointer"
    >
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
        {product.images && product.images.length > 0 ? (
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-6xl">💎</span>
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

      <div>
        <h3 className="text-sm tracking-wide mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm">₹{displayPrice.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-500 line-through">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>
        {product.category && (
          <p className="text-xs text-gray-500 mt-1 capitalize">{product.category}</p>
        )}
      </div>
    </div>
  );
}
