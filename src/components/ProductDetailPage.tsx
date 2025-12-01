import React, { useEffect, useState } from 'react';
import { ShoppingCart, Heart, ArrowLeft, ZoomIn } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { ProductCard } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, data?: any) => void;
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getById(productId);
      setProduct(res.product);
      
      // Load related products from same category
      if (res.product.category) {
        const relatedRes = await productsAPI.getAll({ category: res.product.category });
        const related = (relatedRes.products || [])
          .filter((p: any) => p.id !== productId)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images || [],
      });
    }
    
    // Navigate to cart
    onNavigate('cart');
  };

  const displayPrice = product?.discountPrice || product?.price || 0;
  const hasDiscount = product?.discountPrice && product.discountPrice < product.price;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <button
            onClick={() => onNavigate('shop')}
            className="text-sm tracking-wide text-amber-600 hover:text-amber-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600'];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative group">
              <ImageWithFallback
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-gray-100 rounded overflow-hidden border-2 ${
                      selectedImage === idx
                        ? 'border-black'
                        : 'border-transparent'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <p className="text-sm text-gray-500 tracking-wide uppercase mb-2">
                {product.category}
              </p>
            )}
            
            <h1 className="text-3xl tracking-wide mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">₹{displayPrice.toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-700 mb-6">{product.shortDescription}</p>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white px-6 py-3 text-sm tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>ADD TO CART</span>
              </button>
            </div>

            {/* Buy Now */}
            <button
              onClick={handleAddToCart}
              className="w-full border-2 border-black px-6 py-3 text-sm tracking-wider hover:bg-gray-50 transition-colors mb-6"
            >
              BUY NOW
            </button>

            {/* Product Details */}
            {product.description && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-sm tracking-wider mb-3">DESCRIPTION</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm tracking-wider mb-3">PRODUCT DETAILS</h3>
              <dl className="space-y-2 text-sm">
                {product.weight && (
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Weight:</dt>
                    <dd>{product.weight}</dd>
                  </div>
                )}
                {product.material && (
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Material:</dt>
                    <dd>{product.material}</dd>
                  </div>
                )}
                <div className="flex">
                  <dt className="text-gray-600 w-32">SKU:</dt>
                  <dd>{product.id}</dd>
                </div>
                <div className="flex">
                  <dt className="text-gray-600 w-32">Availability:</dt>
                  <dd className="text-green-600">In Stock</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl tracking-wider mb-8">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
