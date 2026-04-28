import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Filter, X } from 'lucide-react';

const Category = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const subCategoryParam = searchParams.get('subcategory');
  const searchQuery = searchParams.get('q');
  
  const [activeSubCategory, setActiveSubCategory] = useState(subCategoryParam || 'All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (subCategoryParam) {
      setActiveSubCategory(subCategoryParam);
    } else {
      setActiveSubCategory('All');
    }
  }, [subCategoryParam]);

  const subCategories = [
    'All',
    'Running',
    'Jordan',
    'Sandal, Sliders and Flipflop',
    'Football'
  ];

  const handleSubCategoryClick = (sub) => {
    setActiveSubCategory(sub);
    if (sub === 'All') {
      searchParams.delete('subcategory');
    } else {
      searchParams.set('subcategory', sub);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter(p => {
    const categoryMatch = id === 'all' || p.category.toLowerCase() === id?.toLowerCase();
    const subCategoryMatch = activeSubCategory === 'All' || p.subcategory === activeSubCategory;
    const searchMatch = !searchQuery || 
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && subCategoryMatch && searchMatch;
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight dark:text-white">
              {searchQuery ? `Search: "${searchQuery}"` : (id === 'all' ? 'All Products' : `${id}'s Shoes`)} 
              {activeSubCategory !== 'All' && !searchQuery && <span className="text-gray-400 dark:text-gray-600"> / {activeSubCategory}</span>}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              ({filteredProducts.length} Results)
            </p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center space-x-2 font-medium hover:opacity-70 transition-opacity dark:text-white"
          >
            <span>{isSidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
            <Filter size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden md:block overflow-hidden flex-shrink-0"
              >
                <div className="sticky top-28 space-y-8">
                  <div>
                    <h3 className="font-bold mb-4 text-lg dark:text-white">Categories</h3>
                    <ul className="space-y-3">
                      {subCategories.map((sub) => (
                        <li key={sub}>
                          <button
                            onClick={() => handleSubCategoryClick(sub)}
                            className={`text-left w-full transition-all duration-200 ${
                              activeSubCategory === sub 
                                ? 'font-bold dark:text-white translate-x-1' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:translate-x-1'
                            }`}
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Filters */}
          <div className="md:hidden flex overflow-x-auto py-2 space-x-4 no-scrollbar mb-4 border-b border-gray-100 dark:border-gray-800">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubCategoryClick(sub)}
                className={`whitespace-nowrap px-4 py-2 rounded-full border transition-all ${
                  activeSubCategory === sub 
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                    : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10"
              >
                <AnimatePresence mode='popLayout'>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-[#111111] rounded-3xl">
                <h2 className="text-2xl font-medium text-gray-500 dark:text-gray-400">No products found.</h2>
                <p className="mt-2 text-gray-400 dark:text-gray-500">Try adjusting your filters or category.</p>
                <button 
                  onClick={() => {
                    handleSubCategoryClick('All');
                    if (searchQuery) {
                      searchParams.delete('q');
                      setSearchParams(searchParams);
                    }
                  }}
                  className="mt-6 text-black dark:text-white font-bold underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
