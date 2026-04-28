import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Moon, Sun } from 'lucide-react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { wishlist } = useWishlist();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter products based on search query
  const searchResults = searchQuery.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Show top 5 results
    : [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 dark:bg-black/90 dark:border-gray-900 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" 
              alt="Nike" 
              className={`h-6 md:h-8 w-auto transition-all duration-300 group-hover:scale-110 ${
                isDarkMode ? 'invert' : ''
              }`}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 items-center font-bold uppercase tracking-tight">
            <Link to="/category/men" className="hover:text-gray-500 dark:text-white dark:hover:text-gray-400 transition-colors">Men</Link>
            <Link to="/category/women" className="hover:text-gray-500 dark:text-white dark:hover:text-gray-400 transition-colors">Women</Link>
            <Link to="/category/kids" className="hover:text-gray-500 dark:text-white dark:hover:text-gray-400 transition-colors">Kids</Link>
            <Link to="/category/sale" className="hover:text-gray-500 transition-colors text-red-600">Sale</Link>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-5">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <Search size={16} className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500 group-focus-within:text-black'}`} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search" 
                className={`pl-10 pr-4 py-2.5 rounded-full focus:outline-none transition-all w-32 focus:w-64 text-sm font-medium relative z-10 ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20 focus:bg-white/20 text-white placeholder-gray-400' 
                    : 'bg-black/5 hover:bg-black/10 focus:bg-black/10 text-black placeholder-gray-600'
                }`}
              />

              {/* Live Search Results Dropdown */}
              <AnimatePresence>
                {searchQuery.trim() && isSearchFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-[#111111] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 origin-top-right"
                  >
                    {searchResults.length > 0 ? (
                      <div className="flex flex-col">
                        {searchResults.map(product => (
                          <div 
                            key={product.id}
                            onClick={() => {
                              navigate(`/product/${product.id}`);
                              setSearchQuery('');
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                          >
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{product.category} {product.subcategory}</p>
                            </div>
                            <div className="text-sm font-black text-gray-900 dark:text-white">
                              ${product.price}
                            </div>
                          </div>
                        ))}
                        <button 
                          type="submit"
                          className="p-4 text-center text-sm font-bold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors w-full bg-gray-50/50 dark:bg-gray-900/50"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                        No products found for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
            
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-100 text-black'
              }`}
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            
            <Link to="/wishlist" className={`relative p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-100 text-black'
            }`}>
              <Heart size={22} className={wishlist.length > 0 ? "fill-red-500 text-red-500" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className={`relative p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-100 text-black'
            }`}>
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleDarkMode} className={`p-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden border-b border-gray-100 dark:border-gray-900 ${
              isDarkMode ? 'bg-black' : 'bg-white'
            }`}
          >
            <div className="px-6 py-10 space-y-8 font-black uppercase text-2xl tracking-tighter">
              <Link to="/category/men" className="block dark:text-white">Men</Link>
              <Link to="/category/women" className="block dark:text-white">Women</Link>
              <Link to="/category/kids" className="block dark:text-white">Kids</Link>
              <Link to="/category/sale" className="block text-red-600">Sale</Link>
              
              <div className="flex space-x-10 pt-6 border-t border-gray-100 dark:border-gray-900">
                <Link to="/wishlist" className="relative dark:text-white">
                  <Heart size={30} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative dark:text-white">
                  <ShoppingBag size={30} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
