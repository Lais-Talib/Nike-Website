import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick add adds the product with a default size (e.g. 9) or whatever makes sense
    addToCart(product, 9);
    
    // Optional: show some feedback that it was added
    alert('Added to cart!');
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 rounded-2xl mb-4 transition-colors duration-300">
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-white dark:bg-black text-black dark:text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
            Just In
          </div>
        )}
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md hover:bg-white dark:hover:bg-black transition-all shadow-sm"
        >
          <motion.div
            animate={wishlisted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart 
              size={20} 
              className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-900 dark:text-gray-100"} 
            />
          </motion.div>
        </button>

        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <motion.img 
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </Link>
        
        {/* Quick Add Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          className="absolute bottom-4 left-0 w-full px-4"
        >
          <button 
            onClick={handleQuickAdd}
            className="w-full bg-black/90 dark:bg-white/90 text-white dark:text-black py-3.5 rounded-full font-bold flex items-center justify-center space-x-2 hover:scale-[1.02] transition-all active:scale-95 shadow-xl"
          >
            <ShoppingBag size={18} />
            <span>Quick Add</span>
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <Link to={`/product/${product.id}`} className="flex flex-col flex-grow px-1">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:underline underline-offset-2">{product.name}</h3>
          <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">${product.price}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{product.subcategory}</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{product.color}</p>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
