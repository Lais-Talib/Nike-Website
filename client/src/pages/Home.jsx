import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <Hero />
      
      {/* Trending Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 dark:text-white">Trending Now</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">The most sought-after styles this season.</p>
          </div>
          <Link to="/category/all" className="hidden md:flex items-center space-x-2 font-bold uppercase tracking-tight dark:text-white hover:opacity-70 transition-opacity">
            <span>Shop All</span>
            <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 flex justify-center md:hidden">
          <Link to="/category/all" className="flex items-center space-x-2 font-bold bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full uppercase tracking-tight">
            <span>Shop All</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative h-[70vh] w-full rounded-3xl overflow-hidden flex items-center group">
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810baa3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Running" 
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500"></div>
          <div className="relative z-10 p-8 md:p-20 text-white max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-none tracking-tighter">Step into<br/>Greatness</h2>
            <p className="text-lg md:text-xl mb-10 text-white/90 font-medium leading-relaxed">
              Experience the latest innovation in running technology with the all-new ZoomX series. Engineered for speed and comfort.
            </p>
            <Link to="/category/men?subcategory=Running" className="inline-block bg-white text-black font-black uppercase tracking-tight py-4 px-10 rounded-full hover:bg-gray-100 transition-all transform active:scale-95 shadow-2xl">
              Explore Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
