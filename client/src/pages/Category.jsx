import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Filter, X } from 'lucide-react';

const Category = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const subCategoryParam = searchParams.get('subcategory');
  const searchQuery = searchParams.get('q');
  
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubCategory, setActiveSubCategory] = useState(subCategoryParam || 'All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const toggleGender = (gender) => {
    setSelectedGenders(prev => 
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setAllProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  const filteredProducts = allProducts.filter(p => {
    const categoryMatch = id === 'all' || p.category.toLowerCase() === id?.toLowerCase();
    const subCategoryMatch = activeSubCategory === 'All' || p.subcategory === activeSubCategory;
    const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(p.category);
    const searchMatch = !searchQuery || 
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    const sizeMatch = selectedSizes.length === 0 || true; // Simulating size match
    
    return categoryMatch && subCategoryMatch && searchMatch && genderMatch && sizeMatch;
  });

  const sizes = ['6', '7', '8', '9', '10', '11', '12'];

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center flex items-center justify-center flex-col bg-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Loading products...</p>
      </div>
    );
  }

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
                <div className="sticky top-28 pr-8 space-y-10 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-10">
                  {/* Shoes Category */}
                  <div>
                    <h3 className="font-bold text-lg mb-5 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Shoes</h3>
                    <div className="space-y-3">
                      {['Lifestyle', 'Jordan', 'Running', 'Football', 'Training'].map((cat) => (
                        <button 
                          key={cat}
                          onClick={() => handleSubCategoryClick(cat)}
                          className={`block w-full text-left transition-colors ${
                            activeSubCategory === cat 
                              ? 'text-black font-bold dark:text-white' 
                              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clothing Category */}
                  <div>
                    <h3 className="font-bold text-lg mb-5 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Apparel</h3>
                    <div className="space-y-3">
                      {['Tops & T-Shirts', 'Hoodies', 'Jackets', 'Trousers'].map((cat) => (
                        <button 
                          key={cat}
                          onClick={() => handleSubCategoryClick(cat)}
                          className={`block w-full text-left transition-colors ${
                            activeSubCategory === cat 
                              ? 'text-black font-bold dark:text-white' 
                              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="pt-4">
                    <h3 className="font-bold text-lg mb-5 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Shop by Price</h3>
                    <div className="space-y-3">
                      {['Under $50', '$50 - $100', '$100 - $150', 'Over $150'].map((price) => (
                        <button 
                          key={price}
                          className="block w-full text-left text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                          {price}
                        </button>
                      ))}
                    </div>
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
