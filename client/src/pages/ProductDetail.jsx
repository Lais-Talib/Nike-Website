import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../utils/api';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center flex items-center justify-center flex-col bg-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Loading product details...</p>
      </div>
    );
  }

  const apparelSubcategories = ['Tops & T-Shirts', 'Hoodies', 'Jackets', 'Trousers'];
  const isApparel = apparelSubcategories.includes(product.subcategory);
  
  const shoeSizes = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14];
  const apparelSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  const sizes = isApparel ? apparelSizes : shoeSizes;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setShowSizeWarning(true);
      return;
    }
    setShowSizeWarning(false);
    addToCart(product, selectedSize);
    alert('Added to Bag!');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap no-scrollbar"
        >
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-black dark:hover:text-white transition-colors capitalize">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-black dark:text-white font-bold">{product.name}</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left: Product Image */}
          <motion.div 
            className="w-full lg:w-3/5"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] overflow-hidden aspect-square lg:aspect-auto lg:h-[750px] flex items-center justify-center relative transition-colors duration-300">
              {product.isLatest && (
                <div className="absolute top-8 left-8 z-10 bg-black dark:bg-white text-white dark:text-black text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                  Just In
                </div>
              )}
              <motion.img 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div 
            className="w-full lg:w-2/5 flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          >
            <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-2">{product.category} {product.subcategory}</h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 leading-[0.9] dark:text-white">{product.name}</h1>
            <p className="text-3xl font-bold mb-10 dark:text-white">${product.price}</p>
            
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold dark:text-white">Select Size</h3>
                <button className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4">Size Guide</button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setShowSizeWarning(false);
                    }}
                    className={`py-4 border-2 rounded-2xl text-center transition-all duration-200 font-bold ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                        : 'border-gray-100 hover:border-black dark:border-gray-900 dark:hover:border-white text-gray-700 dark:text-gray-300'
                    } ${showSizeWarning && !selectedSize ? 'border-red-500 text-red-500' : ''}`}
                  >
                    {!isApparel ? `US ${size}` : size}
                  </button>
                ))}
              </div>
              {showSizeWarning && (
                <p className="text-red-500 text-sm font-bold mt-2">Please select a size.</p>
              )}
            </div>

            <div className="flex flex-col space-y-4 mb-12 mt-auto">
              <button 
                onClick={handleAddToBag}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-black text-lg uppercase tracking-tight hover:opacity-90 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-3 shadow-2xl"
              >
                <ShoppingBag size={22} />
                <span>Add to Bag</span>
              </button>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`w-full py-5 border-2 rounded-full font-black text-lg uppercase tracking-tight transition-all active:scale-[0.98] flex items-center justify-center space-x-3 ${
                  isWishlisted 
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500' 
                    : 'border-gray-100 hover:border-black dark:border-gray-900 dark:text-white dark:hover:border-white'
                }`}
              >
                <Heart size={22} className={isWishlisted ? "fill-red-500" : ""} />
                <span>{isWishlisted ? 'Saved to Favorites' : 'Favorite'}</span>
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-900 pt-10">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-8 font-medium">
                {product.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="font-bold dark:text-white w-32 uppercase text-sm tracking-widest text-gray-400">Color:</span>
                  <span className="font-bold dark:text-white">{product.color}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-bold dark:text-white w-32 uppercase text-sm tracking-widest text-gray-400">Style:</span>
                  <span className="font-bold dark:text-white">{product.subcategory}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
