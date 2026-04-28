import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-gray-100 dark:border-gray-900 pb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight dark:text-white flex items-center">
            Favorites
            <span className="ml-4 p-2 bg-gray-50 dark:bg-gray-900 rounded-full">
              <Heart size={24} className="fill-red-500 text-red-500" />
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-bold">
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>

        {wishlist.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            <AnimatePresence mode='popLayout'>
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-gray-50 dark:bg-[#111111] rounded-[3rem]"
          >
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white dark:bg-gray-900 rounded-full shadow-sm">
                <Heart size={48} className="text-gray-300 dark:text-gray-700" />
              </div>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight dark:text-white">Items added to your Favorites will be saved here.</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto font-medium">
              Find something you love? Tap the heart icon to save it for later.
            </p>
            <Link 
              to="/category/all" 
              className="mt-10 inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Start Shopping
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
